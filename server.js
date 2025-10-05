// --- Imports ---
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const prettier = require('prettier');

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
        const functionName = getFunctionName(userCode);
        if (!functionName) {
            throw new Error("Could not automatically determine the function name to export.");
        }
        
        const codeToRun = `${userCode}\nmodule.exports = { ${functionName} };`;
        await fs.promises.writeFile(userCodePath, codeToRun);

        const testCodeToRun = `const { ${functionName} } = require('./user_code.js');\n${testCode}`;
        await fs.promises.writeFile(testCodePath, testCodeToRun);

        return new Promise((resolve, reject) => {
            exec(`jest --json --testPathPattern=${tempDir.replace(/\\/g, '/')}`, { cwd: tempDir, timeout: 15000 }, (error, stdout, stderr) => {
                if (stderr && !stdout) { // Only reject if there's a real execution error
                    return reject(new Error(`Server error during test execution: ${stderr}`));
                }
                // Jest exits with non-zero code for failing tests, but that's expected.
                // We always resolve with stdout if it exists, as it contains the JSON results.
                if (stdout) {
                    resolve(stdout);
                } else {
                    reject(new Error(`Test execution failed and produced no output. Error: ${error}`));
                }
            });
        });

    } finally {
        fs.promises.rm(tempDir, { recursive: true, force: true }).catch(err => console.error(`Failed to clean up temp directory: ${err}`));
    }
}

// Helper function to extract function name from user's code
function getFunctionName(code) {
    // Look for `function functionName()` or `const functionName = () =>`
    const match = code.match(/(?:function\s+|const\s+)([a-zA-Z0-9_]+)\s*(?:=|\()/);
    return match ? match[1] : null;
}

// --- API Endpoints ---
app.get('/', (req, res) => res.status(200).send('Vexor.AI backend is running.'));
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

        const apiResponse = await axios.post(CEREBRAS_API_URL, {
            model: "llama3.1-8b",
            prompt: formattedPrompt,
            max_tokens: 1000,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let generated_tests = apiResponse.data.choices[0].text;
        generated_tests = generated_tests.replace(/```javascript/g, "").replace(/```/g, "").trim();
        generated_tests = await prettier.format(generated_tests, { parser: "babel" });

        const jestOutput = await runInSandbox(code, generated_tests);
        const results = JSON.parse(jestOutput);

        res.status(200).send({
            score: results.numTotalTests > 0 ? Math.round((results.numPassedTests / results.numTotalTests) * 100) : 0,
            total_tests: results.numTotalTests,
            passed: results.numPassedTests,
            failed: results.numFailedTests,
            output: results.testResults[0]?.assertionResults.map(r => `[${r.status.toUpperCase()}] ${r.title}`).join('\n') || "No assertion results found.",
            generated_tests,
        });

    } catch (error) {
        console.error('Critical error in /assert endpoint:', error.response ? error.response.data : error.message);
        res.status(500).send({ error: `An unexpected server error occurred: ${error.message}` });
    }
});

// --- PageSpeed Insights Endpoint (with improved error handling) ---
app.post('/pagespeed', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).send({ error: 'URL is required.' });
    }

    const GOOGLE_PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!GOOGLE_PAGESPEED_API_KEY) {
        return res.status(500).send({ error: 'Google PageSpeed API key is not configured on the server.' });
    }

    const API_URL = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${GOOGLE_PAGESPEED_API_KEY}&strategy=desktop`;

    try {
        const response = await axios.get(API_URL);

        if (response.data.lighthouseResult && response.data.lighthouseResult.categories) {
            const { categories } = response.data.lighthouseResult;
            res.status(200).send({
                performance: Math.round((categories.performance?.score || 0) * 100),
                accessibility: Math.round((categories.accessibility?.score || 0) * 100),
                bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
                seo: Math.round((categories.seo?.score || 0) * 100),
            });
        } else {
            const errorMessage = response.data.error?.message || "The URL could not be audited by Google PageSpeed.";
            return res.status(400).send({ error: errorMessage });
        }

    } catch (error) {
        console.error('Error fetching PageSpeed data:', error.response ? error.response.data : error.message);
        res.status(500).send({ error: `Failed to analyze the URL: ${error.message}` });
    }
});

// --- Server Listener ---
const server = app.listen(PORT, () => {
    console.log(`✅ VEXOR.AI server listening on port ${PORT}`);
});

module.exports = { app, server }; // Export for testing