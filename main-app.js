// --- IMPORTANT: Set your backend URL here ---
const RENDER_URL = 'https://vexor-ai.onrender.com'; // Backend API URL
// --- Monaco Editor Setup ---
let editor;
let testEditor;
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    const isDark = document.documentElement.classList.contains('dark');
    const theme = isDark ? 'vs-dark' : 'vs-light';

    // Main editor for user code
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `function example(a, b) {\n  return a + b;\n}`,
        language: 'javascript',
        theme: theme,
        automaticLayout: true,
        minimap: { enabled: false }
    });

    // Read-only editor for generated tests
    testEditor = monaco.editor.create(document.getElementById('test-editor'), {
        value: `// AI-generated tests will appear here...`,
        language: 'javascript',
        theme: theme,
        automaticLayout: true,
        readOnly: true,
        minimap: { enabled: false }
    });

    // Update theme if dark mode is toggled (listens for event from common.js)
     const themeToggle = document.getElementById('theme-toggle');
     if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            const newTheme = isDark ? 'vs-dark' : 'vs-light';
            monaco.editor.setTheme(newTheme);
        });
     }
});

// --- Main API Call Function ---
async function handleCodeAction(mode) {
  const code = editor.getValue();
  const functionName = document.getElementById('function-name-input').value.trim();
  const language = 'javascript';
  
  const resultsPanel = document.getElementById('results-panel');
  const testBtn = document.getElementById('test-btn');
  const refactorBtn = document.getElementById('refactor-btn');
  const explainBtn = document.getElementById('explain-btn');

  if (mode === 'assert' && !functionName) {
    alert('Please enter the name of the function you want to test.');
    return;
  }

  // Reset UI
  resultsPanel.innerHTML = '<div class="spinner"></div><p>Vexor is thinking...</p>';
  testEditor.setValue('');
  [testBtn, refactorBtn, explainBtn].forEach(btn => btn.disabled = true);

  let endpoint = '';
  let body = {};
  
  if (mode === 'assert') {
      endpoint = `${RENDER_URL}/assert`;
      body = { code, personality: 'engineer', language, functionName };
  } else {
      endpoint = `${RENDER_URL}/analyze`;
      body = { code, mode }; 
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }
    
    const data = await response.json();

    // Handle response based on mode
    if (mode === 'assert') {
        testEditor.setValue(data.generated_tests);
        const scoreColor = getScoreColor(data.score);
        const resultsHeader = `
<h3 class="text-xl font-bold mb-2">Test Results</h3>
<div class="flex flex-wrap space-x-4 sm:space-x-6 mb-4">
  <div><strong>Score:</strong> <span class="text-2xl font-bold" style="color: ${scoreColor};">${data.score}%</span></div>
  <div><strong>Total:</strong> ${data.total_tests}</div>
  <div class="text-green-400"><strong>Passed:</strong> ${data.passed}</div>
  <div class="text-red-400"><strong>Failed:</strong> ${data.failed}</div>
</div>
        `;
        resultsPanel.innerHTML = resultsHeader + '<pre>' + data.output + '</pre>';
    } else if (mode === 'refactor') {
        testEditor.setValue(data.content);
        resultsPanel.innerHTML = `<h3 class="text-xl font-bold mb-2">Refactor Analysis</h3><pre>${data.analysis || 'Code refactored.'}</pre>`;
    } else if (mode === 'explain') {
        testEditor.setValue('// Explanation appears in the Results panel below.');
        resultsPanel.innerHTML = `<h3 class="text-xl font-bold mb-2">Code Explanation</h3><pre>${data.content}</pre>`;
    }

  } catch (error) {
    console.error('Error:', error);
    resultsPanel.innerHTML = `<h3 class="text-xl font-bold text-red-400 mb-2">An Error Occurred</h3><pre>${error.message}</pre>`;
  } finally {
    [testBtn, refactorBtn, explainBtn].forEach(btn => btn.disabled = false);
  }
}

// --- Event Listeners for this page ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('test-btn').addEventListener('click', () => handleCodeAction('assert'));
    document.getElementById('refactor-btn').addEventListener('click', () => handleCodeAction('refactor'));
    document.getElementById('explain-btn').addEventListener('click', () => handleCodeAction('explain'));
});

// --- Utility Functions ---
function getScoreColor(score) {
    if (score >= 90) return '#34d399'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
}
