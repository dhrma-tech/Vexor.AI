import { RENDER_URL } from './utils.js'; // <-- NEW: Import the RENDER_URL

document.addEventListener('DOMContentLoaded', () => {

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          themeToggle.textContent = isDark ? '☀️' : '🌙';
          
          if (typeof monaco !== 'undefined' && monaco.editor) {
            monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
          }
        });
    }

    // --- "Start Free" Buttons ---
    document.body.addEventListener('click', (e) => {
        const startButton = e.target.closest('.start-free-btn');
        if (startButton) {
            e.preventDefault();
            window.location.hash = '#/sparring';
        }
    });

    // --- Demo Modal ---
    const demoModal = document.getElementById('demo-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (demoModal && closeModalBtn) {
        document.body.addEventListener('click', (e) => {
            if (e.target.id === 'watch-demo-btn') {
                demoModal.classList.remove('hidden');
            }
        });

        closeModalBtn.addEventListener('click', () => demoModal.classList.add('hidden'));
        
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                demoModal.classList.add('hidden');
            }
        });
    }

    // --- VEXOR Chatbot Toggle ---
    const chatPopup = document.getElementById('vexor-chat-popup');
    const chatToggle = document.getElementById('vexor-chat-toggle');
    const chatClose = document.getElementById('vexor-chat-close');
    const messageArea = document.getElementById('vexor-message-area');
    const chatInput = document.getElementById('vexor-chat-input');
    const chatSend = document.getElementById('vexor-chat-send');

    if (chatPopup && chatToggle && chatClose && messageArea && chatInput && chatSend) {
        
        chatPopup.classList.add('chat-hidden');
        
        const openChat = () => {
            chatPopup.classList.remove('hidden');
            setTimeout(() => {
                chatPopup.classList.remove('chat-hidden');
                chatPopup.classList.add('chat-visible');
            }, 10);
            chatToggle.classList.add('hidden');
        };

        const closeChat = () => {
            chatPopup.classList.remove('chat-visible');
            chatPopup.classList.add('chat-hidden');
            setTimeout(() => {
                chatPopup.classList.add('hidden');
            }, 300);
            chatToggle.classList.remove('hidden');
        };

        const addMessage = (sender, text) => {
            const messageWrapper = document.createElement('div');
            const messageBubble = document.createElement('div');
            
            if (sender === 'user') {
                messageWrapper.className = 'flex justify-end';
                messageBubble.className = 'bg-blue-600 text-white p-3 rounded-lg max-w-xs';
            } else { // 'vexor'
                messageWrapper.className = 'flex';
                messageBubble.className = 'bg-gray-700 text-white p-3 rounded-lg max-w-xs';
            }
            
            messageBubble.textContent = text;
            messageWrapper.appendChild(messageBubble);
            messageArea.appendChild(messageWrapper);
            messageArea.scrollTop = messageArea.scrollHeight;
        };

        // --- UPDATED: This function now calls your backend API ---
        const handleSend = async () => {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage('user', text);
            chatInput.value = '';
            chatSend.disabled = true;

            // Add a temporary typing indicator
            addMessage('vexor', '...');

            try {
                const response = await fetch(`${RENDER_URL}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Something went wrong');
                }
                
                const data = await response.json();
                
                // Remove the "..." typing indicator
                messageArea.removeChild(messageArea.lastChild);
                addMessage('vexor', data.reply);

            } catch (error) {
                // Remove the "..." typing indicator
                messageArea.removeChild(messageArea.lastChild);
                addMessage('vexor', `Sorry, an error occurred: ${error.message}`);
                console.error("Error in VEXOR chat:", error);
            } finally {
                chatSend.disabled = false;
                chatInput.focus();
            }
        };
        // --- End of updated function ---

        chatToggle.addEventListener('click', openChat);
        chatClose.addEventListener('click', closeChat);
        chatSend.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    } else {
        console.error("VEXOR Chatbot UI elements not found. Make sure all IDs are correct in index.html.");
    }
});
