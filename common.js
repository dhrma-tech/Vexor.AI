// Replace your common.js with this

document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          themeToggle.textContent = isDark ? '☀️' : '🌙';
          if (typeof monaco !== 'undefined') {
            monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
          }
        });
    }

    // --- "Start Free" Buttons ---
    document.body.addEventListener('click', (e) => {
        // Find the closest 'start-free-btn' or 'data-link' to the clicked element
        const startButton = e.target.closest('.start-free-btn');
        if (startButton) {
            e.preventDefault();
            
            // Check if it's also a data-link (like in the header)
            if (startButton.matches('[data-link]')) {
                // If it is, let the main router handle it
                window.location.hash = startButton.getAttribute('href');
            } else {
                // If it's just a button (like in the footer), go to the app
                window.location.hash = '#/app';
            }
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
            if (e.target === demoModal) { // Close if clicking on the background
                demoModal.classList.add('hidden');
            }
        });
    }
});
