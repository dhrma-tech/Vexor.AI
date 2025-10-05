// --- Monaco Editor Setup ---
let editor;
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `function example(a, b) {\n  return a + b;\n}`,
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true
    });
});

// --- Dark Mode Toggle ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
});

// --- IMPORTANT: Set your backend URL here ---
const RENDER_URL = 'https://vexor-ai.onrender.com'; // <-- Replace with your actual Render URL

// --- Generate Tests (Calls the backend) ---
async function generateTests() {
  const code = editor.getValue();
  const personality = 'engineer';
  const language = 'javascript';
  const btn = document.getElementById('test-free');
  const originalText = btn.textContent;
  btn.innerHTML = '<span class="spinner mr-2"></span>Generating...';
  btn.disabled = true;

  try {
    const response = await fetch(`${RENDER_URL}/assert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, personality, language }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }
    const data = await response.json();
    alert('Generated Tests:\n\n' + data.generated_tests);

  } catch (error) {
    console.error('Error:', error);
    alert(`An error occurred: ${error.message}`);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Test Generation
    document.getElementById('test-free').addEventListener('click', generateTests);

    // "Start Free" Buttons
    document.querySelectorAll('.start-free-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('editor').scrollIntoView({ behavior: 'smooth' });
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

    // PageSpeed Analyzer
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

    function getScoreColor(score) {
        if (score >= 90) return '#34d399'; // Green
        if (score >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    }
});