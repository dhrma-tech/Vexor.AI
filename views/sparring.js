import { RENDER_URL, getScoreColor } from '../utils.js';

// This view holds the logic for the Monaco editors
let editor;
let testEditor;

// Helper for "auto-typing" text
function typeEffect(element, text, speed = 50) {
    let i = 0;
    element.setValue('');
    function type() {
        if (i < text.length) {
            element.setValue(element.getValue() + text.charAt(i));
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

const SparringView = {
    render: async () => {
        return `
        <section class="bg-transparent py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">The AI Sparring Partner for Your Code</h1>
            <p class="text-xl mb-8 max-w-3xl mx-auto">Paste your functions, get instant tests, refactor suggestions, or explanations. No setup, instant value.</p>
            
            <div class="max-w-xl mx-auto mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="function-name-input" class="block text-sm font-medium text-gray-400 mb-1 text-left">Function Name</label>
                    <input type="text" id="function-name-input" placeholder="Function name auto-detected..." class="w-full px-4 py-3 border border-gray-600 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label for="personality-select" class="block text-sm font-medium text-gray-400 mb-1 text-left">Test Personality</label>
                    <select id="personality-select" class="w-full px-4 py-3 border border-gray-600 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="engineer">Senior Engineer</option>
                        <option value="drill_sergeant">QA Drill Sergeant</option>
                    </select>
                </div>
            </div>

            <div id="action-tabs" class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button data-mode="assert" class="action-tab active-tab flex-1 px-8 py-3">Generate Tests</button>
              <button data-mode="refactor" class="action-tab flex-1 px-8 py-3">Refactor Code</button>
              <button data-mode="explain" class="action-tab flex-1 px-8 py-3">Explain Code</button>
            </div>

            <div id="editor-layout" class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div id="editor-wrapper">
                <label class="block text-lg font-medium mb-2">Your Code</label>
                <div id="editor" style="height: 300px;"></div>
              </div>
              <div id="test-editor-wrapper">
                <label class="block text-lg font-medium mb-2">AI Generated Output</label>
                <div id="test-editor" style="height: 300px;"></div>
              </div>
              <div id="results-wrapper" class="md:col-span-2">
                <label class="block text-lg font-medium mb-2">Results</label>
                <div id="results-panel">
                  Click a button above to get started...
                </div>
              </div>
            </div>
          </div>
        </section>
        `;
    },
    after_render: async () => {
        // All the JS from main-app.js goes here
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            const isDark = document.documentElement.classList.contains('dark');
            const theme = isDark ? 'vs-dark' : 'vs-light';

            const exampleCode = `function example(a, b) {\n  return a + b;\n}`;
            const exampleTests = `// AI-generated tests will appear here...`;

            editor = monaco.editor.create(document.getElementById('editor'), {
                value: '', // Start empty for typing effect
                language: 'javascript',
                theme: theme,
                automaticLayout: true,
                minimap: { enabled: false }
            });

            testEditor = monaco.editor.create(document.getElementById('test-editor'), {
                value: exampleTests,
                language: 'javascript',
                theme: theme,
                automaticLayout: true,
                readOnly: true,
                minimap: { enabled: false }
            });

            // "Fascinating" Feature: Auto-typing intro
            typeEffect(editor, exampleCode, 75);

            // "Fascinating" Feature: Smart function detection
            const functionNameInput = document.getElementById('function-name-input');
            editor.onDidChangeModelContent(() => {
                const code = editor.getValue();
                const match = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
                if (match && match[1]) {
                    functionNameInput.value = match[1];
                    functionNameInput.placeholder = "Function name auto-detected!";
                }
            });

            // Update theme if dark mode is toggled
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const isDark = document.documentElement.classList.contains('dark');
                    const newTheme = isDark ? 'vs-dark' : 'vs-light';
                    monaco.editor.setTheme(newTheme);
                });
            }
        });
        
        // --- NEW Event Listener for Action Tabs ---
        const actionTabs = document.getElementById('action-tabs');
        
        actionTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.action-tab');
            if (!tab || tab.disabled) return;

            const mode = tab.dataset.mode;

            // Set active tab style
            actionTabs.querySelectorAll('.action-tab').forEach(t => {
                t.classList.remove('active-tab');
            });
            tab.classList.add('active-tab');

            // Adjust layout based on mode *before* calling
            adjustLayoutForMode(mode);
            
            // Call the action
            handleCodeAction(mode);
        });

        // Set initial layout
        adjustLayoutForMode('assert');
    },
    unmount: () => {
        // Destroy Monaco instances to prevent memory leaks
        if (editor) {
            editor.dispose();
            editor = null;
        }
        if (testEditor) {
            testEditor.dispose();
            testEditor = null;
        }
        console.log("Sparring view unmounted");
    }
};

// --- NEW: Layout Adjustment Function ---
function adjustLayoutForMode(mode) {
    const editorLayout = document.getElementById('editor-layout');
    const testEditorWrapper = document.getElementById('test-editor-wrapper');
    const resultsWrapper = document.getElementById('results-wrapper');

    if (mode === 'explain') {
        testEditorWrapper.style.display = 'none';
        resultsWrapper.classList.remove('md:col-span-2');
        resultsWrapper.classList.add('md:col-span-2'); // Keep it full width
        editorLayout.classList.remove('md:grid-cols-2');
        editorLayout.classList.add('md:grid-cols-1'); // Stack editor and results
    } else {
        testEditorWrapper.style.display = 'block';
        resultsWrapper.classList.add('md:col-span-2');
        editorLayout.classList.remove('md:grid-cols-1');
        editorLayout.classList.add('md:grid-cols-2');
    }
}

// --- Main API Call Function (from main-app.js) ---
async function handleCodeAction(mode) {
    if (!editor) return; // Guard against uninitialized editor

    const code = editor.getValue();
    const functionName = document.getElementById('function-name-input').value.trim();
    const personality = document.getElementById('personality-select').value; // Get personality
    const language = 'javascript';
    
    const resultsPanel = document.getElementById('results-panel');
    const actionTabs = document.getElementById('action-tabs');

    if (mode === 'assert' && !functionName) {
        alert('Please enter the name of the function you want to test (or paste code to auto-detect).');
        return;
    }

    // Reset UI
    resultsPanel.innerHTML = '<div class="spinner"></div><p>Vexor is thinking...</p>';
    if (mode !== 'explain') {
        testEditor.setValue('');
    }
    actionTabs.querySelectorAll('.action-tab').forEach(btn => btn.disabled = true);

    let endpoint = '';
    let body = {};
    
    if (mode === 'assert') {
        endpoint = `${RENDER_URL}/assert`;
        body = { code, personality: personality, language, functionName }; // Use selected personality
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
            // We don't touch testEditor, just the results panel
            resultsPanel.innerHTML = `<h3 class="text-xl font-bold mb-2">Code Explanation</h3><pre>${data.content}</pre>`;
        }

    } catch (error) {
        console.error('Error:', error);
        resultsPanel.innerHTML = `<h3 class="text-xl font-bold text-red-400 mb-2">An Error Occurred</h3><pre>${error.message}</pre>`;
    } finally {
        actionTabs.querySelectorAll('.action-tab').forEach(btn => btn.disabled = false);
    }
}

export default SparringView;
