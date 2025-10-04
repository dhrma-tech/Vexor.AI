// --- DOM Elements ---
const form = document.getElementById('code-form');
const submitButton = document.getElementById('submit-button');
const loader = document.getElementById('loader');
const resultsSection = document.getElementById('results-section');
const userCodeInput = document.getElementById('user-code');
const languageSelector = document.getElementById('language');

// --- Event Listener ---
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the browser from reloading

    const userCode = userCodeInput.value;
    const personality = document.querySelector('input[name="personality"]:checked').value;
    const language = languageSelector.value;

    if (!userCode.trim()) {
        alert('Please paste some code to test.');
        return;
    }

    // --- UI Updates: Start Loading ---
    submitButton.disabled = true;
    loader.style.display = 'block';
    resultsSection.style.display = 'none';

    try {
        // --- API Call ---
        const response = await fetch('/assert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: userCode,
                personality: personality,
                language: language,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        const outputElement = document.getElementById('sandbox-output');
        const generatedTestsElement = document.getElementById('generated-tests');
        
        outputElement.textContent = `An error occurred:\n${error.message}`;
        generatedTestsElement.textContent = 'N/A';
        
        // Also update the score card to show an error state
        const scoreCard = document.getElementById('score-card');
        scoreCard.className = 'score-card fail';
        document.getElementById('score').textContent = 'Error';
        document.getElementById('score-summary').textContent = 'Could not run tests.';

        resultsSection.style.display = 'block';
    } finally {
        // --- UI Updates: Stop Loading ---
        submitButton.disabled = false;
        loader.style.display = 'none';
    }
});

// --- Helper Function ---
function displayResults(data) {
    // Display scores
    document.getElementById('score').textContent = `${data.score.toFixed(0)}%`;
    document.getElementById('score-summary').textContent = `Robustness Score (${data.passed} passed, ${data.failed} failed)`;

    // Display generated tests and sandbox output
    document.getElementById('generated-tests').textContent = data.generated_tests;
    document.getElementById('sandbox-output').textContent = data.output;

    // Update the score card color based on the score
    const scoreCard = document.getElementById('score-card');
    scoreCard.className = 'score-card'; // Reset classes
    if (data.score === 100) {
        scoreCard.classList.add('success');
    } else {
        scoreCard.classList.add('fail');
    }

    // Show the entire results section
    resultsSection.style.display = 'block';
}