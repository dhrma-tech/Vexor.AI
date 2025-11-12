import { RENDER_URL, getScoreColor } from '../utils.js';

const AnalyzerView = {
    render: async () => {
        return `
        <section id="pagespeed" class="py-20 bg-transparent bg-grid">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2>Analyze Your Website's Performance</h2>
            <p class="text-lg text-slate-200 mt-4 mb-8">Enter a URL to get a free performance, accessibility, and SEO report.</p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input type="url" id="url-input" placeholder="https://example.com" class="flex-grow px-4 py-3 rounded-md text-white focus:outline-none focus:ring-2">
              <button id="analyze-btn" class="start-free-btn px-8 py-3 disabled:opacity-50">Analyze</button>
            </div>
            <div id="results-container" class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" style="display: none;"></div>
          </div>
        </section>
        `;
    },
    after_render: async () => {
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

        // Updated to display stats as plain text
        function displayResults(data) {
            const scores = [
                { label: 'Performance', value: data.performance, color: getScoreColor(data.performance) },
                { label: 'Accessibility', value: data.accessibility, color: getScoreColor(data.accessibility) },
                { label: 'Best Practices', value: data.bestPractices, color: getScoreColor(data.bestPractices) },
                { label: 'SEO', value: data.seo, color: getScoreColor(data.seo) },
            ];
            scores.forEach(score => {
                // Plain text stat style
                const scoreCard = `
                    <div class="bg-transparent p-6">
                        <div class="text-5xl font-bold" style="color: ${score.color};">${score.value}</div>
                        <p class="text-slate-300 mt-2">${score.label}</p>
                    </div>
                `;
                resultsContainer.innerHTML += scoreCard;
            });
            resultsContainer.style.display = 'grid';
        }
    },
    unmount: () => {
        console.log("Analyzer view unmounted");
    }
};

export default AnalyzerView;
