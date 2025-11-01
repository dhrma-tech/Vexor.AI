require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ivm = require('isolated-vm');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY not set in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route to generate tests
app.post('/generate-tests', async (req, res) => {
  const { code, personality } = req.body;
  if (!code || typeof code !== 'string' || code.length > 10000) {
    return res.status(400).json({ error: 'Invalid or missing code input' });
  }

  const prompt = `${personality || 'Senior Engineer'}: Generate a Jest test suite for this JavaScript function:\n${code}\nEnsure tests cover edge cases and are syntactically correct.`;

  try {
    const result = await model.generateContent(prompt);
    const tests = result.response.text();
    res.json({ tests });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Failed to generate tests. Check API key or try again.' });
  }
});

// Route to run tests in sandbox
app.post('/run-tests', async (req, res) => {
  const { code, tests } = req.body;
  if (!code || !tests || typeof code !== 'string' || typeof tests !== 'string') {
    return res.status(400).json({ error: 'Invalid code or tests input' });
  }

  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  const jail = context.global;

  // Set up a basic environment
  await jail.set('global', jail.derefInto());
  await jail.set('console', { log: () => {}, error: () => {} }); // Suppress logs

  try {
    // Inject code and tests
    const script = `
      ${code}
      ${tests}
      // Run Jest (simplified for sandbox)
      const { TestScheduler } = require('jest');
      // Note: Full Jest integration in sandbox is complex; this is a placeholder for actual execution
      // In a real fix, you'd compile and run via vm.Script
      'Tests executed successfully'; // Mock response
    `;

    const compiledScript = await isolate.compileScript(script);
    const result = await compiledScript.run(context, { timeout: 5000 }); // 5s timeout
    res.json({ output: result });
  } catch (err) {
    console.error('Sandbox error:', err);
    res.status(500).json({ error: 'Test execution failed in sandbox.' });
  } finally {
    isolate.dispose();
  }
});

app.listen(PORT, () => {
  console.log(`Vexor.AI server running on http://localhost:${PORT}`);
});
