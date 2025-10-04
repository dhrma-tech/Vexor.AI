// ... (keep Monaco setup and other code as-is)

// Generate Tests (Real OpenAI – replace YOUR_API_KEY)
async function generateTests() {
  const code = editor.getValue();
  const language = 'javascript'; // Detect via Monaco if needed
  const btn = document.getElementById('test-free');
  const originalText = btn.textContent;
  btn.innerHTML = '<span class="spinner mr-2"></span>Generating...';
  btn.disabled = true;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE'}` // Use env or hardcode for testing
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Generate a comprehensive Jest test suite for this ${language} function, focusing on edge cases, errors, and reliability. Include at least 5 tests. Code: ${code}`
        }],
        max_tokens: 500
      })
    });
    const data = await response.json();
    const tests = data.choices[0]?.message?.content || '// Error: No tests generated. Check API key.';
    alert('Generated Tests:\n' + tests); // Or render in a modal/editor pane
  } catch (error) {
    console.error('OpenAI error:', error);
    alert('// Fallback Mock: describe("Your Function", () => { it("handles edges", () => { expect(fn()).toBeDefined(); }); });');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// ... (rest unchanged)