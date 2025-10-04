// ... (keep Monaco setup and other code as-is)

// Generate Tests (Calls the backend)
async function generateTests() {
  const code = editor.getValue();
  const personality = 'engineer'; // You can change this to get different personalities
  const language = 'javascript';
  const btn = document.getElementById('test-free');
  const originalText = btn.textContent;
  btn.innerHTML = '<span class="spinner mr-2"></span>Generating...';
  btn.disabled = true;

  try {
    const response = await fetch('/assert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        personality,
        language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    const data = await response.json();
    alert('Generated Tests:\n' + data.generated_tests); // Or render in a modal/editor pane
  } catch (error) {
    console.error('Error:', error);
    alert(`An error occurred: ${error.message}`);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// ... (rest unchanged)