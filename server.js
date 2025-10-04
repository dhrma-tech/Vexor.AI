// --- Imports ---
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios'); // Use axios for API calls
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Cerebras API Configuration ---
const CEREBRAS_API_URL = "https://api.cerebras.com/v1/completions"; // Correct API endpoint

// --- Prompts for AI Personalities ---
const PROMPT_TEMPLATES = {
    "engineer": `You are a professional Senior Software Engineer. Write a complete and robust test suite for the following JavaScript code using the Jest framework. Cover typical use cases and follow best practices. Your response must be only the JavaScript code for the tests. Do not include the original function, explanations, or any markdown formatting.\n\nCode:\n{user_code}`,
    "drill_sergeant": `You are a ruthless QA Automation Lead specializing in breaking software. Generate a vast array of punishing test cases for the following JavaScript code using Jest. Focus on edge cases, invalid inputs, error conditions, and boundary values. Your response must be only the JavaScript code for the tests. Do not include the original function, explanations, or any markdown formatting.\n\nCode:\n{user_code}`
};

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- Sandbox Function ---
async function runInSandbox(userCode, testCode) {
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'vexor-'));
    const userCodePath = path.join(tempDir, 'user_code.js');
    const testCodePath = path.join(tempDir, 'user_code.test.js');

    try {
        await fs.promises.writeFile(userCodePath, userCode);
        await fs.promises.writeFile(testCodePath, testCode);

        return new Promise((resolve, reject) => {
            // NOTE: This requires Jest to be installed globally or as a dev dependency in your project.
            // If it's not installed, run: npm install --save-dev jest
            exec(`jest --json ${testCodePath}`, { cwd: tempDir, timeout: 15000 }, (error, stdout, stderr) => {
                if (stderr) {
                    console.error('Sandbox stderr:', stderr);
                    reject(new Error(`Server error during test execution: ${stderr}`));
                    return;
                }
                resolve(stdout);
            });
        });

    } finally {
        fs.promises.rm(tempDir, { recursive: true, force: true });
    }
}

// --- API Endpoints ---
app.get('/health', (req, res) => res.status(200).send({ status: 'ok' }));

app.post('/assert', async (req, res) => {
    const { code, personality } = req.body;
    if (!code || !personality) {
        return res.status(400).send({ error: 'Code and personality are required.' });
    }

    try {
        // --- 1. Generate Tests using Cerebras AI with axios ---
        const promptTemplate = PROMPT_TEMPLATES[personality] || PROMPT_TEMPLATES["engineer"];
        const formattedPrompt = promptTemplate.replace('{user_code}', code);

        const response = await axios.post(CEREBRAS_API_URL, {
            model: "llama3.1-8b",
            prompt: formattedPrompt,
            max_tokens: 500,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let generated_tests = response.data.choices[0].text;
        generated_tests = generated_tests.replace(/```javascript/g, "").replace(/```/g, "").trim();

        // --- 2. Run in Sandbox ---
        const jestOutput = await runInSandbox(code, generated_tests);
        const results = JSON.parse(jestOutput);

        // --- 3. Parse Results ---
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
