// --- IMPORTANT: Set your backend URL here ---
const RENDER_URL = 'http://localhost:3000'; // <-- Make sure this is your Render URL or localhost

document.addEventListener('DOMContentLoaded', () => {
    // --- PageSpeed Analyzer ---
    const analyzeBtn = document.getElementById('analyze-btn');
    const urlInput = document.getElementById('url-input');
    const resultsContainer = document.getElementById('results-container');

    if (analyzeBtn) {
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
    }

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
