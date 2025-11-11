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
    document.querySelectorAll('.start-free-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            // If we are already on the main page, scroll. Otherwise, go to it.
            if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
                 document.getElementById('editor-container').scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'index.html'; // Go to the main app page
            }
        });
    });

    // --- Demo Modal ---
    const demoModal = document.getElementById('demo-modal');
    const watchDemoBtn = document.getElementById('watch-demo-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (demoModal && watchDemoBtn && closeModalBtn) {
        watchDemoBtn.addEventListener('click', () => demoModal.classList.remove('hidden'));
        closeModalBtn.addEventListener('click', () => demoModal.classList.add('hidden'));
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) { // Close if clicking on the background
                demoModal.classList.add('hidden');
            }
        });
    }
});
