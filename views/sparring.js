import { RENDER_URL, getScoreColor } from '../utils.js';

let editor;
let testEditor;

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
            <h1>The AI Sparring Partner for Your Code</h1>
            <p class="text-xl mt-4 mb-8 max-w-3xl mx-auto">Paste your functions, get instant tests, refactor suggestions, or explanations. No setup, instant value.</p>
            
            <!-- Inputs now use global styles -->
            <div class="max-w-xl mx-auto mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="function-name-input" class="block text-sm font-medium text-gray-400 mb-1 text-left">Function Name</label>
                    <input type="text" id="function-name-input" placeholder="Function name auto-detected..." class="w-full px-4 py-3" required>
                </div>
                <div>
                    <label for="personality-select" class="block text-sm font-medium text-gray-400 mb-1 text-left">Test Personality</label>
                    <select id="personality-select" class="w-full px-4 py-3">
                        <option value="engineer">Senior Engineer</option>
                        <option value="drill_sergeant">QA Drill Sergeant</option>
                    </select>
                </div>
            </div>

            <!-- Action Tabs: Updated to new pill style -->
            <div id="action-tabs" class="flex flex-row gap-4 justify-center mb-12">
              <button data-mode="assert" class="action-tab active-tab flex-1 px-8 py-3">Generate Tests</button>
              <button data-mode="refactor" class="action-tab flex-1 px-8 py-3">Refactor Code</button>
              <button data-mode="explain" class="action-tab flex-1 px-8 py-3">Explain Code</button>
            </div>

            <!-- Editor Layout: Wrappers now have .glowing-card -->
            <div id="editor-layout" class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              
              <div id="editor-wrapper" class="glowing-card p-4">
                <label class="block text-lg font-medium mb-2">Your Code</label>
                <div id="editor" style="height: 300px;"></div>
              </div>
              
              <div id="test-editor-wrapper" class="glowing-card p-4">
                <label class="block text-lg font-medium mb-2">AI Generated Output</label>
                <div id="test-editor" style="height: 300px;"></div>
              </div>
              
              <div id="results-wrapper" class="md:col-span-2 glowing-card p-4">
                <label class="block text-lg font-medium mb-2">Results</label>
                <div id="results-panel" class="bg-transparent p-0">
                  Click a button above to get started...
                </div>
              </div>
            </div>
          </div>
        </section>
        `;
    },
    after_render: async () => {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            const isDark = true; // Hardcode to dark theme for this aesthetic
            const theme = 'vs-dark';

            const exampleCode = `function example(a, b) {\n  return a + b;\n}`;
            const exampleTests = `// AI-generated tests will appear here...`;

            editor = monaco.editor.create(document.getElementById('editor'), {
                value: '',
                language: 'javascript',
                theme: theme,
                automaticLayout: true,
                minimap: { enabled: false },
                background: 'transparent' // Make editor bg transparent
            });

            testEditor = monaco.editor.create(document.getElementById('test-editor'), {
                value: exampleTests,
                language: 'javascript',
                theme: theme,
                automaticLayout: true,
                readOnly: true,
                minimap: { enabled: false },
                background: 'transparent' // Make editor bg transparent
            });

            typeEffect(editor, exampleCode, 75);

            const functionNameInput = document.getElementById('function-name-input');
            editor.onDidChangeModelContent(() => {
                const code = editor.getValue();
                const match = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
                if (match && match[1]) {
                    functionNameInput.value = match[1];
                    functionNameInput.placeholder = "Function name auto-detected!";
                }
            });

            // Theme toggle logic (though we're hardcoding dark)
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    // This will just toggle light/dark mode for text/card colors
                    document.documentElement.classList.toggle('dark');
                    const isDark = document.documentElement.classList.contains('dark');
                    monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
                });
            }
        });
        
        // Simplified Event Listener for Action Tabs
        const actionTabs = document.getElementById('action-tabs');
        actionTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.action-tab');
            if (!tab || tab.disabled) return;

            const mode = tab.dataset.mode;

            // Simple class toggle
            actionTabs.querySelectorAll('.action-tab').forEach(t => {
                t.classList.remove('active-tab');
            });
            tab.classList.add('active-tab');

            adjustLayoutForMode(mode);
            handleCodeAction(mode);
        });

        adjustLayoutForMode('assert');
    },
    unmount: () => {
        if (editor) editor.dispose();
        if (testEditor) testEditor.dispose();
        editor = null;
        testEditor = null;
    }
};

// Layout Adjustment Function (Unchanged)
function adjustLayoutForMode(mode) {
    const editorLayout = document.getElementById('editor-layout');
    const testEditorWrapper = document.getElementById('test-editor-wrapper');
    const resultsWrapper = document.getElementById('results-wrapper');

    if (mode === 'explain') {
        testEditorWrapper.style.display = 'none';
        resultsWrapper.classList.remove('md:col-span-2');
        resultsWrapper.classList.add('md:col-span-2');
        editorLayout.classList.remove('md:grid-cols-2');
        editorLayout.classList.add('md:grid-cols-1');
    } else {
        testEditorWrapper.style.display = 'block';
        resultsWrapper.classList.add('md:col-span-2');
        editorLayout.classList.remove('md:grid-cols-1');
        editorLayout.classList.add('md:grid-cols-2');
    }
}

// API Call Function (Unchanged)
async function handleCodeAction(mode) {
    if (!editor) return;

    const code = editor.getValue();
    const functionName = document.getElementById('function-name-input').value.trim();
    const personality = document.getElementById('personality-select').value;
    const language = 'javascript';
    
    const resultsPanel = document.getElementById('results-panel');
    const actionTabs = document.getElementById('action-tabs');

    if (mode === 'assert' && !functionName) {
        alert('Please enter the name of the function you want to test (or paste code to auto-detect).');
        return;
    }

    resultsPanel.innerHTML = '<div class="spinner"></div><p>Vexor is thinking...</p>';
    if (mode !== 'explain') {
        testEditor.setValue('');
    }
    actionTabs.querySelectorAll('.action-tab').forEach(btn => btn.disabled = true);

    let endpoint = '';
    let body = {};
    
    if (mode === 'assert') {
        endpoint = `${RENDER_URL}/assert`;
        body = { code, personality, language, functionName };
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
