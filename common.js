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
});
