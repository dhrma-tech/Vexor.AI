document.addEventListener('DOMContentLoaded', () => {

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          themeToggle.textContent = isDark ? '☀️' : '🌙';
          
          // Check if Monaco is loaded before trying to set its theme
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
            // All "Start Free" buttons should navigate to the sparring app
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
    const chatSend = document.getElementById('vexor-chat-send'); // This line was failing

    // This check is crucial. If chatSend is null, this block is skipped.
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

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (text) {
                addMessage('user', text);
                chatInput.value = '';
                
                setTimeout(() => {
                    addMessage('vexor', "I'm not fully connected yet, but I'm ready to help once my developer wires me up to the Groq API!");
                }, 1000);
            }
        };

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
