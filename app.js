// --- IMPORTANT: Set your backend URL here ---
// ⬇️ ⬇️ ⬇️ PASTE YOUR RENDER URL HERE ⬇️ ⬇️ ⬇️
const RENDER_URL = 'https://vexor-ai.onrender.com'; // <-- REPLACE THIS
// ⬆️ ⬆️ ⬆️ PASTE YOUR RENDER URL HERE ⬆️ ⬆️ ⬆️


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
});

// --- Dark Mode Toggle ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  const newTheme = isDark ? 'vs-dark' : 'vs-light';
  monaco.editor.setTheme(newTheme);
});


// --- NEW: Main API Call Function ---
async function handleCodeAction(mode) {
  const code = editor.getValue();
  const functionName = document.getElementById('function-name-input').value.trim();
  const language = 'javascript';
  
  // UI Elements
  const loadingOverlay = document.getElementById('loading-overlay');
  const resultsPanel = document.getElementById('results-panel');
  const testBtn = document.getElementById('test-btn');
  const refactorBtn = document.getElementById('refactor-btn');
  const explainBtn = document.getElementById('explain-btn');

  if (mode === 'assert' && !functionName) {
    alert('Please enter the name of the function you want to test.');
    return;
  }

  // Reset UI
  loadingOverlay.classList.remove('hidden');
  resultsPanel.textContent = '';
  testEditor.setValue('');
  [testBtn, refactorBtn, explainBtn].forEach(btn => btn.disabled = true);

  let endpoint = '';
  let body = {};
  
  if (mode === 'assert') {
      endpoint = `${RENDER_URL}/assert`;
      body = { code, personality: 'engineer', language, functionName }; // Using 'engineer' as default
  } else {
      endpoint = `${RENDER_URL}/analyze`;
      body = { code, mode }; // 'mode' will be 'refactor' or 'explain'
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
        // Format test results
        const scoreColor = getScoreColor(data.score);
        const resultsHeader = `
<h3 class="text-xl font-bold mb-2">Test Results</h3>
<div class="flex space-x-6 mb-4">
  <div><strong>Score:</strong> <span class="text-2xl font-bold" style="color: ${scoreColor};">${data.score}%</span></div>
  <div><strong>Total:</strong> ${data.total_tests}</div>
  <div class="text-green-400"><strong>Passed:</strong> ${data.passed}</div>
  <div class="text-red-400"><strong>Failed:</strong> ${data.failed}</div>
</div>
        `;
        resultsPanel.innerHTML = resultsHeader + '<pre>' + data.output + '</pre>';
    } else if (mode === 'refactor') {
        testEditor.setValue(data.content); // Put refactored code in the test editor
        resultsPanel.innerHTML = `<h3 class="text-xl font-bold mb-2">Refactor Analysis</h3><pre>${data.analysis || 'Code refactored.'}</pre>`;
    } else if (mode === 'explain') {
        testEditor.setValue('// Explanation appears in the Results panel below.');
        resultsPanel.innerHTML = `<h3 class="text-xl font-bold mb-2">Code Explanation</h3><pre>${data.content}</pre>`;
    }

  } catch (error) {
    console.error('Error:', error);
    resultsPanel.innerHTML = `<h3 class="text-xl font-bold text-red-400 mb-2">An Error Occurred</h3><pre>${error.message}</pre>`;
  } finally {
    loadingOverlay.classList.add('hidden');
    [testBtn, refactorBtn, explainBtn].forEach(btn => btn.disabled = false);
  }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // NEW: Action Buttons
    document.getElementById('test-btn').addEventListener('click', () => handleCodeAction('assert'));
    document.getElementById('refactor-btn').addEventListener('click', () => handleCodeAction('refactor'));
    document.getElementById('explain-btn').addEventListener('click', () => handleCodeAction('explain'));

    // "Start Free" Buttons
    document.querySelectorAll('.start-free-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('editor-container').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // "Watch Demo" Modal
    const demoModal = document.getElementById('demo-modal');
    const watchDemoBtn = document.getElementById('watch-demo-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    watchDemoBtn.addEventListener('click', () => demoModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => demoModal.classList.add('hidden'));
    demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) { // Close if clicking on the background
            demoModal.classList.add('hidden');
        }
    });

    // PageSpeed Analyzer (This logic remains unchanged)
    const analyzeBtn = document.getElementById('analyze-btn');
    const urlInput = document.getElementById('url-input');
    const resultsContainer = document.getElementById('results-container');

    analyzeBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert('Please enter a valid URL.');
            return;
        }
        const originalText = analyzeBtn.textContent;
        analyzeBtn.innerHTML = '<span class="spinner mr-2"></span>Analyzing...';
        analyzeBtn.disabled = true;
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';

        try {
            const response = await fetch(`${RENDER_URL}/pagespeed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get a valid response.');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            analyzeBtn.textContent = originalText;
            analyzeBtn.disabled = false;
        }
    });

    function displayResults(data) {
        const scores = [
            { label: 'Performance', value: data.performance, color: getScoreColor(data.performance) },
            { label: 'Accessibility', value: data.accessibility, color: getScoreColor(data.accessibility) },
            { label: 'Best Practices', value: data.bestPractices, color: getScoreColor(data.bestPractices) },
            { label: 'SEO', value: data.seo, color: getScoreColor(data.seo) },
        ];
        scores.forEach(score => {
            const scoreCard = `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="text-5xl font-bold" style="color: ${score.color};">${score.value}</div>
                    <p class="text-gray-600 mt-2">${score.label}</p>
                </div>
            `;
            resultsContainer.innerHTML += scoreCard;
        });
        resultsContainer.style.display = 'grid';
    }
});

function getScoreColor(score) {
    if (score >= 90) return '#34d399'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
}
