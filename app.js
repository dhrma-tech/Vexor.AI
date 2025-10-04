// Monaco Editor Setup
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
  const editor = monaco.editor.create(document.getElementById('editor'), {
    value: '// Paste your function here\nfunction add(a, b) {\n  return a + b;\n}',
    language: 'javascript',
    theme: 'vs-dark', // Default dark for dev feel
    minimap: { enabled: false },
    fontSize: 14
  });

  // Generate Tests (Mock – fetches if server endpoint exists, else sample alert)
  function generateTests() {
    const code = editor.getValue();
    const language = 'javascript'; // Detect via Monaco if needed
    // Show spinner
    const btn = document.getElementById('test-free');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="spinner mr-2"></span>Generating...';
    btn.disabled = true;

    fetch('/generate-tests', {  // Your existing endpoint (no changes here)
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    })
    .then(response => response.json())
    .then(({ tests }) => {
      alert('Generated Tests:\n' + (tests || '// Mock: describe("Test", () => { it("passes", () => {}); });'));
    })
    .catch(() => {
      alert('// Mock Tests: describe("Your Function", () => { it("handles edges", () => {}); });');
    })
    .finally(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    });
  }

  // Event Listeners
  document.getElementById('test-free').addEventListener('click', generateTests);
  document.getElementById('start-free').addEventListener('click', generateTests); // Reuse for nav
  document.getElementById('cta-free').addEventListener('click', generateTests); // Footer CTA
});

// Theme Toggle
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  toggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
  toggle.textContent = '☀️';
}

// Smooth Scroll for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});