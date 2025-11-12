document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle ---
    // REMOVED
    
    // --- "Start Free" Buttons ---
    document.body.addEventListener('click', (e) => {
        // Find the closest 'start-free-btn'
        const startButton = e.target.closest('.start-free-btn');
        if (startButton) {
            e.preventDefault();
            // All "Start Free" buttons (in header or footer) now go to the app
            window.location.hash = '#/app';
        }
    });

    // --- Demo Modal ---
    const demoModal = document.getElementById('demo-modal');
    
    // Check for modal existence
    if (demoModal) {
        const closeModalBtn = document.getElementById('close-modal-btn');

        // Open Modal
        document.body.addEventListener('click', (e) => {
            if (e.target.id === 'watch-demo-btn') {
                demoModal.classList.remove('hidden');
                demoModal.classList.add('flex'); // Make it visible and centered
            }
        });

        // Close Modal (Button)
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                demoModal.classList.add('hidden');
                demoModal.classList.remove('flex');
            });
        }

        // Close Modal (Background Click)
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) { // Close if clicking on the background
                demoModal.classList.add('hidden');
                demoModal.classList.remove('flex');
            }
        });
    }

    // --- NEW: Vexor Chat Widget Logic ---
    const chatToggle = document.getElementById('vexor-chat-toggle');
    const chatWidget = document.getElementById('vexor-chat-widget');
    const chatInput = document.getElementById('vexor-chat-input');
    const chatHistory = document.getElementById('vexor-chat-history');

    if (chatToggle && chatWidget) {
        // Toggle the chat window
        chatToggle.addEventListener('click', () => {
            chatWidget.classList.toggle('hidden');
            chatToggle.textContent = chatWidget.classList.contains('hidden') ? '?' : '×';
        });
    }

    if (chatInput && chatHistory) {
        // Send message on Enter
        chatInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                const userMessage = chatInput.value.trim();
                chatInput.value = ''; // Clear input

                // 1. Add user message to UI
                addChatMessage('user', userMessage);

                // 2. Call your backend
                // Using the RENDER_URL from your utils.js file
                const RENDER_URL = 'https://vexor-ai.onrender.com'; 

                try {
                    const response = await fetch(`${RENDER_URL}/chat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: userMessage })
                    });

                    if (!response.ok) {
                         const errorData = await response.json();
                         throw new Error(errorData.error || 'Network response was not ok');
                    }
                    
                    const data = await response.json();
                    
                    // 3. Add AI reply to UI
                    addChatMessage('assistant', data.reply);

                } catch (error) {
                    console.error('Chat Error:', error);
                    addChatMessage('assistant', `Sorry, I ran into an error: ${error.message}`);
                }
            }
        });
    }

    function addChatMessage(role, message) {
        const msgEl = document.createElement('div');
        msgEl.classList.add('mb-3', 'text-sm');
        
        // Basic sanitation to prevent HTML injection
        const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (role === 'user') {
            msgEl.classList.add('text-right');
            msgEl.innerHTML = `<span class="inline-block p-2 bg-violet-700 text-white rounded-lg max-w-xs text-left">${safeMessage}</span>`;
        } else {
            msgEl.classList.add('text-left');
            // This is basic, for a real app you'd want a markdown parser
            const formattedMessage = safeMessage.replace(/\n/g, '<br>');
            msgEl.innerHTML = `<span class="inline-block p-2 bg-slate-800 text-slate-300 rounded-lg max-w-xs">${formattedMessage}</span>`;
        }
        
        chatHistory.appendChild(msgEl);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to bottom
    }
    // --- END Vexor Chat Widget Logic ---
    
});
