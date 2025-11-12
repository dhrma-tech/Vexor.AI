// In SparringView.render()
// ...
<div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
    <div id="action-tabs" class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <button id="test-btn" data-mode="assert" class="action-tab active-tab flex-1 bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50">Generate Tests</button>
        <button id="refactor-btn" data-mode="refactor" class="action-tab flex-1 bg-gray-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-600 disabled:opacity-50">Refactor Code</button>
        <button id="explain-btn" data-mode="explain" class="action-tab flex-1 bg-gray-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-600 disabled:opacity-50">Explain Code</button>
    </div>
</div>

<div id="editor-layout" class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
    <div id="editor-wrapper">
        <label class="block text-lg font-medium mb-2">Your Code</label>
        <div id="editor" style="height: 300px; border: 1px solid #334155;" class="rounded-lg"></div>
    </div>
    <div id="test-editor-wrapper">
        <label class="block text-lg font-medium mb-2">AI Generated Output</label>
        <div id="test-editor" style="height: 300px; border: 1px solid #334155;" class="rounded-lg"></div>
    </div>
    <div id="results-wrapper" class="md:col-span-2">
        <label class="block text-lg font-medium mb-2">Results</label>
        <div id="results-panel" class="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm" style="min-height: 100px;">
            Click a button above to get started...
        </div>
    </div>
</div>
// ...
// In SparringView.after_render()
// ...
// --- Event Listeners for new tabs ---
const actionTabs = document.getElementById('action-tabs');
let currentMode = 'assert'; // Default mode

actionTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.action-tab');
    if (!tab) return;

    // Remove active class from all tabs
    actionTabs.querySelectorAll('.action-tab').forEach(t => {
        t.classList.remove('active-tab');
        t.classList.add('bg-gray-700', 'hover:bg-gray-600');
        t.classList.remove('bg-blue-600');
    });

    // Add active class to clicked tab
    tab.classList.add('active-tab');
    tab.classList.remove('bg-gray-700', 'hover:bg-gray-600');
    tab.classList.add('bg-blue-600');

    // Get the new mode
    currentMode = tab.dataset.mode;
    
    // Adjust layout
    adjustLayoutForMode(currentMode);
});

// Initial layout adjustment
adjustLayoutForMode(currentMode);

// --- Main API Call Function (from main-app.js) ---
async function handleCodeAction() { // No need for mode argument, we use currentMode
    // ... (rest of the function setup) ...
    
    // USE a single button listener on the parent
    // We will call this function from the tab click, but we need to trigger the *action*.
    // Let's refactor this. The tab click should *only* set the mode.
    // We need a single "Run" button.
}

// ... THIS IS A BETTER UX ...
// Let's rethink. The user picked the files I gave them. The *buttons* are the actions.
// My original idea was better. Let's go back.

// In SparringView.after_render()
// ... (Monaco setup) ...
const actionTabs = document.getElementById('action-tabs');
const editorLayout = document.getElementById('editor-layout');
const testEditorWrapper = document.getElementById('test-editor-wrapper');
const resultsWrapper = document.getElementById('results-wrapper');

actionTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.action-tab');
    if (!tab) return;
    
    const mode = tab.dataset.mode;

    // Don't run if disabled
    if (tab.disabled) return;

    // Set active tab style
    actionTabs.querySelectorAll('.action-tab').forEach(t => {
        t.classList.remove('active-tab', 'bg-blue-600');
        t.classList.add('bg-gray-700', 'hover:bg-gray-600');
    });
    tab.classList.add('active-tab', 'bg-blue-600');
    tab.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    // Adjust layout for mode
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
    
    // Call the action
    handleCodeAction(mode);
});

// Remove old button listeners
// document.getElementById('test-btn').addEventListener('click', () => handleCodeAction('assert'));
// ... (etc)
