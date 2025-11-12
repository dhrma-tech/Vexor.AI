// Replace your app.js with this

import HomeView from './views/home.js'; // <-- Import new home view
import SparringView from './views/sparring.js';
import AnalyzerView from './views/analyzer.js';
import PricingView from './views/pricing.js';

// This simple router maps URL hashes to view objects
const routes = {
    '/': HomeView,             // <-- Default route is now HomeView
    '/app': SparringView,      // <-- Sparring is now at #/app
    '/sparring': SparringView, // <-- Alias for "Sparring" nav link
    '/analyzer': AnalyzerView,
    '/pricing': PricingView,
};

let currentView = null;

const router = async () => {
    const path = window.location.hash.slice(1) || '/';
    const view = routes[path] || routes['/']; 

    if (currentView && typeof currentView.unmount === 'function') {
        currentView.unmount();
    }
    
    const app = document.getElementById('app-root');
    if (!app) {
        console.error("Fatal error: #app-root element not found.");
        return;
    }
    
    currentView = view;
    app.innerHTML = await view.render();
    
    // Scroll to top on new view
    window.scrollTo(0, 0);

    if (currentView && typeof currentView.after_render === 'function') {
        await currentView.after_render();
    }
};

document.body.addEventListener('click', e => {
    // Check if the target or its parent is a data-link
    const link = e.target.closest('[data-link]');
    if (link) {
        e.preventDefault();
        const newHash = link.getAttribute('href');
        if (window.location.hash !== newHash) {
            window.location.hash = newHash;
        }
    }
});

window.addEventListener('hashchange', router);

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
        window.location.hash = '#/';
    }
    router();
});
