// --- DOM Elements ---
const form = document.getElementById('code-form');
const submitButton = document.getElementById('submit-button');
const loader = document.getElementById('loader');
const resultsSection = document.getElementById('results-section');
const userCodeInput = document.getElementById('user-code');

// --- Event Listener ---
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the browser from reloading

    const userCode = userCodeInput.value;
    const personality = document.querySelector('input[name="personality"]:checked').value;

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
        // This is where we talk to our backend server!
        const response = await fetch('/assert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: userCode,
                personality: personality,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        const outputElement = document.getElementById('sandbox-output');
        outputElement.textContent = `An error occurred while contacting the server:\n${error.message}`;
        // Make sure the results section is visible to show the error
        document.getElementById('generated-tests').textContent = 'N/A';
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
