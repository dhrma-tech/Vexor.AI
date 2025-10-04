// --- Imports ---
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // This serves your HTML, CSS, and JS files

// --- API Endpoints ---
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', message: 'Server is running' });
});

app.post('/assert', async (req, res) => {
  const { code, personality } = req.body;

  if (!code || !personality) {
    return res.status(400).send({ error: 'Code and personality are required.' });
  }

  try {
    const mockData = {
      score: 85.7,
      total_tests: 7,
      passed: 6,
      failed: 1,
      output: "==================== 6 passed, 1 failed in 0.10s ====================",
      generated_tests: `import pytest\n\n# Tests generated for personality: ${personality}\n\nassert True # Placeholder`,
    };
    res.status(200).send(mockData);
  } catch (error) {
    console.error('Error in /assert endpoint:', error);
    res.status(500).send({ error: 'An unexpected server error occurred.' });
  }
});

// --- Server Listener ---
app.listen(PORT, () => {
  console.log(`✅ VEXOR.AI server listening on port ${PORT}`);
});

