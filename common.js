document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          themeToggle.textContent = isDark ? '☀️' : '🌙';
          // Tries to set Monaco theme if it exists, but doesn't fail if it doesn't
          if (typeof monaco !== 'undefined') {
            monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
          }
        });
    }

    // --- "Start Free" Buttons ---
    // This will now work globally, even when the view changes
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('start-free-btn')) {
            e.preventDefault();
            // If we are on the main page, just scroll (or handle as needed)
            if (window.location.pathname === '/') {
                 document.getElementById('editor-container')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                // If on another page, navigate to the main page using the router
                history.pushState(null, null, '/');
                window.dispatchEvent(new PopStateEvent('popstate')); // Triggers the router
            }
        }
    });

    // --- Demo Modal ---
    const demoModal = document.getElementById('demo-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (demoModal && closeModalBtn) {
        // We use event delegation on the body in case watch-demo-btn is loaded by the router
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
