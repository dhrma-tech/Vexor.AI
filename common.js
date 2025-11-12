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
        // Find the closest 'start-free-btn'
        const startButton = e.target.closest('.start-free-btn');
        if (startButton) {
            e.preventDefault();
            // All "Start Free" buttons now go to the app
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
            }
        });

        // Close Modal (Button)
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                demoModal.classList.add('hidden');
            });
        }

        // Close Modal (Background Click)
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) { // Close if clicking on the background
                demoModal.classList.add('hidden');
            }
        });
    }
});
