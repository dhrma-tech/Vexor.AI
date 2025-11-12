import { RENDER_URL, getScoreColor } from '../utils.js';

const AnalyzerView = {
    render: async () => {
        // This is the HTML content from the old analyzer.html <section>
        return `
        <section id="pagespeed" class="py-20 bg-transparent text-white">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Analyze Your Website's Performance</h2>
            <p class="text-lg text-gray-300 mb-8">Enter a URL to get a free performance, accessibility, and SEO report.</p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input type="url" id="url-input" placeholder="https://example.com" class="flex-grow px-4 py-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button id="analyze-btn" class="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50">Analyze</button>
            </div>
            <div id="results-container" class="mt-12 grid md:grid-cols-4 gap-6 text-center" style="display: none;"></div>
          </div>
        </section>
        `;
    },
    after_render: async () => {
        // All the JS from analyzer-app.js goes here
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
                resultsContainer.innerHTML = `<p class="text-red-400 md:col-span-4">An error occurred: ${error.message}</p>`;
                resultsContainer.style.display = 'grid';
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
                    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div class="text-5xl font-bold" style="color: ${score.color};">${score.value}</div>
                        <p class="text-gray-400 mt-2">${score.label}</p>
                    </div>
                `;
                resultsContainer.innerHTML += scoreCard;
            });
            resultsContainer.style.display = 'grid';
        }
    },
    unmount: () => {
        // No complex cleanup needed for this view
        console.log("Analyzer view unmounted");
    }
};

export default AnalyzerView;
