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
