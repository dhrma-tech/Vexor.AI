// --- Imports ---
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const { VM } = require('vm2');
const prettier = require('prettier');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Cerebras API Configuration ---
const CEREBRAS_API_URL = "https://api.cerebras.com/v1/completions";

// --- Prompts for AI Personalities ---
const PROMPT_TEMPLATES = {
    "engineer": `You are a professional Senior Software Engineer. Write a complete and robust test suite for the following JavaScript code using the Jest framework. Cover typical use cases and follow best practices. Your response must be only the JavaScript code for the tests. Do not include the original function, explanations, or any markdown formatting.\n\nCode:\n{user_code}`,
    "drill_sergeant": `You are a ruthless QA Automation Lead specializing in breaking software. Generate a vast array of punishing test cases for the following JavaScript code using Jest. Focus on edge cases, invalid inputs, error conditions, and boundary values. Your response must be only the JavaScript code for the tests. Do not include the original function, explanations, or any markdown formatting.\n\nCode:\n{user_code}`,
    "beginner": `You are a friendly coding tutor. Create a simple and easy-to-understand set of tests for the following JavaScript code using Jest. Explain each test case with a simple comment. Your response must be only the JavaScript code for the tests. Do not include the original function, explanations, or any markdown formatting.\n\nCode:\n{user_code}`,
    "security_expert": `You are a security expert. Analyze the following JavaScript code for potential security vulnerabilities and write Jest tests to exploit them. Focus on injection, XSS, and other common attack vectors. Your response must be only the JavaScript code for the tests. Do not include the original function, explanations, or any markdown formatting.\n\nCode:\n{user_code}`,
    "performance_analyst": `You are a performance analyst. Write Jest tests that benchmark the performance of the following JavaScript code. Include tests for execution time and memory usage if possible. Your response must be only the JavaScript code for the tests. Do not include the original function, explanations, or any markdown formatting.\n\nCode:\n{user_code}`
};

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// --- Sandbox Function ---
async function runInSandbox(userCode, testCode) {
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'vexor-'));
    const userCodePath = path.join(tempDir, 'user_code.js');
    const testCodePath = path.join(tempDir, 'user_code.test.js');

    try {
        await fs.promises.writeFile(userCodePath, userCode);
        await fs.promises.writeFile(testCodePath, testCode);

        return new Promise((resolve, reject) => {
            const vm = new VM({
                timeout: 15000,
                sandbox: {
                    require: (moduleName) => {
                        if (moduleName === 'jest') {
                            return require('jest');
                        }
                        throw new Error(`Module '${moduleName}' is not allowed.`);
                    },
                    console: console
                }
            });

            const jestCommand = `
                const jest = require('jest');
                async function runTests() {
                    const project = '${tempDir}';
                    const config = {
                        roots: [project],
                        testMatch: ['**/*.test.js'],
                        json: true,
                        reporters: [], // Suppress console output from Jest
                    };
                    try {
                        const { results } = await jest.runCLI(config, [project]);
                        return results;
                    } catch (error) {
                        return { error: error.message };
                    }
                }
                runTests();
            `;

            try {
                const result = vm.run(jestCommand);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });

    } finally {
        fs.promises.rm(tempDir, { recursive: true, force: true });
    }
}

// --- API Endpoints ---
app.get('/health', (req, res) => res.status(200).send({ status: 'ok' }));

app.post('/assert', async (req, res) => {
    const { code, personality, language } = req.body;
    if (!code || !personality || !language) {
        return res.status(400).send({ error: 'Code, personality, and language are required.' });
    }
    if (language !== 'javascript') {
        return res.status(400).send({ error: 'Only JavaScript is currently supported.' });
    }

    try {
        const promptTemplate = PROMPT_TEMPLATES[personality] || PROMPT_TEMPLATES["engineer"];
        const formattedPrompt = promptTemplate.replace('{user_code}', code);

        const response = await axios.post(CEREBRAS_API_URL, {
            model: "llama3.1-8b",
            prompt: formattedPrompt,
            max_tokens: 1000,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let generated_tests = response.data.choices[0].text;
        generated_tests = generated_tests.replace(/```javascript/g, "").replace(/```/g, "").trim();
        generated_tests = await prettier.format(generated_tests, { parser: "babel" });

        const jestOutput = await runInSandbox(code, generated_tests);

        if (jestOutput.error) {
            throw new Error(jestOutput.error);
        }

        const results = jestOutput;
        const passed = results.numPassedTests;
        const failed = results.numFailedTests;
        const total_tests = results.numTotalTests;
        const score = total_tests > 0 ? (passed / total_tests) * 100 : 0;

        res.status(200).send({
            score: Math.round(score),
            total_tests,
            passed,
            failed,
            output: results.testResults[0]?.assertionResults.map(r => `[${r.status.toUpperCase()}] ${r.title}`).join('\n') || "Tests ran, but no output was captured.",
            generated_tests,
        });

    } catch (error) {
        console.error('Critical error in /assert endpoint:', error.response ? error.response.data : error.message);
        res.status(500).send({ error: `An unexpected server error occurred: ${error.message}` });
    }
});

// --- Server Listener ---
app.listen(PORT, () => {
    console.log(`✅ VEXOR.AI server listening on port ${PORT}`);
});