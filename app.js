import SparringView from './views/sparring.js';
import AnalyzerView from './views/analyzer.js';
import PricingView from './views/pricing.js';

// This simple router maps URL hashes to view objects
const routes = {
    '/': SparringView,
    '/analyzer': AnalyzerView,
    '/pricing': PricingView,
};

let currentView = null;

const router = async () => {
    // Get the path from the hash, or default to "/"
    const path = window.location.hash.slice(1) || '/';
    const view = routes[path] || routes['/']; // Default to Sparring view

    // 1. Unmount the old view (if it has an unmount method)
    if (currentView && typeof currentView.unmount === 'function') {
        currentView.unmount();
    }
    
    // 2. Find the root element and render the new view's HTML
    const app = document.getElementById('app-root');
    if (!app) {
        console.error("Fatal error: #app-root element not found.");
        return;
    }
    
    currentView = view;
    app.innerHTML = await view.render();

    // 3. Mount the new view (if it has an after_render method)
    if (currentView && typeof currentView.after_render === 'function') {
        await currentView.after_render();
    }
};

// Handle navigation (when user clicks a data-link)
document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const newHash = e.target.getAttribute('href');
        if (window.location.hash !== newHash) {
            window.location.hash = newHash;
            // The 'hashchange' event will trigger the router
        }
    }
});

// Listen for hash changes (browser back/forward or link clicks)
window.addEventListener('hashchange', router);

// Load the router on initial page load
document.addEventListener('DOMContentLoaded', () => {
    // Set default hash if none exists
    if (!window.location.hash) {
        window.location.hash = '#/';
    }
    router();
});
