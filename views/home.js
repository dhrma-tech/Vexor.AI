// Create a new file: /views/home.js

const HomeView = {
    render: async () => {
        // This is the HTML for our new landing page.
        // Note the "hidden-anim" class on sections we want to animate.
        return `
        <section class.="py-20 text-center flex flex-col justify-center items-center" style="height: 90vh;">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 text-white">The AI Sparring Partner for Your Code</h1>
            <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Paste your functions. Get instant tests, refactors, and explanations. No setup, instant value.
            </a-link>
            <div class="flex gap-4">
                <a href="#/app" data-link class="start-free-btn bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700">
                    Start Sparring Now
                </a>
                <button id="watch-demo-btn" class="bg-gray-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-600">
                    Watch Demo
                </button>
            </div>
            <div class="mt-20 text-gray-400 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>

        <section class="py-32 hidden-anim">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-3xl font-bold text-white mb-4">Find Every Edge Case</h2>
                    <p class="text-lg text-gray-300 mb-6">
                        Stop guessing. Our AI generates a comprehensive Jest test suite for your functions, finding bugs you didn't know existed.
                    </p>
                    <a href="#/app" data-link class="text-blue-400 text-lg font-semibold hover:text-blue-300">
                        Try the Test Generator &rarr;
                    </a>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg shadow-2xl">
                    <label class="block text-sm font-medium mb-2 text-gray-400">AI Generated Tests</label>
                    <div id="test-editor-preview" style="height: 300px;" class="rounded-lg"></div>
                </div>
            </div>
        </section>

        <section class="py-32 hidden-anim">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                <div class="bg-gray-800 p-6 rounded-lg shadow-2xl grid grid-cols-2 gap-4 text-center">
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <div class="text-5xl font-bold" style="color: #34d399;">92</div>
                        <p class="text-gray-400 mt-2">Performance</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <div class="text-5xl font-bold" style="color: #34d399;">100</div>
                        <p class="text-gray-400 mt-2">Accessibility</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <div class="text-5xl font-bold" style="color: #34d399;">100</div>
                        <p class="text-gray-400 mt-2">Best Practices</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <div class="text-5xl font-bold" style="color: #f59e0b;">85</div>
                        <p class="text-gray-400 mt-2">SEO</p>
                    </div>
                </div>
                <div>
                    <h2 class="text-3xl font-bold text-white mb-4">Analyze Any Website</h2>
                    <p class="text-lg text-gray-300 mb-6">
                        Go beyond your code. Our Website Analyzer, powered by Google PageSpeed, gives you a complete audit of any URL in seconds.
                    </p>
                    <a href="#/analyzer" data-link class="text-blue-400 text-lg font-semibold hover:text-blue-300">
                        Try the Website Analyzer &rarr;
                    </a>
                </div>
            </div>
        </section>

        <section class="py-32 hidden-anim">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-3xl font-bold text-center text-white mb-12">Devs Love Vexor</h2>
              <div class="grid md:grid-cols-3 gap-8">
                <blockquote class="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <p class="text-gray-300 mb-4">"Caught 15 edge cases I missed—game-changer for my side project."</p>
                  <cite class="font-semibold text-white">– Asmit, Indie Dev</cite>
                </blockquote>
                <blockquote class="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <p class="text-gray-300 mb-4">"Simple, fast, and integrates perfectly with our CI pipeline."</p>
                  <cite class="font-semibold text-white">– Bhushan,Team Lead, Startup</cite>
                </blockquote>
                <blockquote class="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <p class="text-gray-300 mb-4">"Like having an AI QA engineer on demand."</p>
                  <cite class="font-semibold text-white">– Marisha, Beginner Full-Stack Engineer</cite>
                </blockquote>
              </div>
            </div>
        </section>
        `;
    },
    after_render: async () => {
        // --- This is the "Scrollytelling" JavaScript ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible-anim');
                    // Optional: stop observing once it's visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        // "Watch" all elements with the "hidden-anim" class
        const hiddenElements = document.querySelectorAll('.hidden-anim');
        hiddenElements.forEach(el => observer.observe(el));

        // --- Create a Read-Only Monaco Editor for the preview ---
        const previewCode = `
describe('example', () => {
  test('should return 3 for 1 + 2', () => {
    expect(example(1, 2)).toBe(3);
  });

  test('should handle negative numbers', () => {
    expect(example(-1, -1)).toBe(-2);
  });

  test('should handle zero', () => {
    expect(example(0, 0)).toBe(0);
  });
});
        `;

        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            monaco.editor.create(document.getElementById('test-editor-preview'), {
                value: previewCode,
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
                readOnly: true,
                minimap: { enabled: false }
            });
        });
    },
    unmount: () => {
        // No cleanup needed, but good practice to have it
        console.log("Home view unmounted");
    }
};

export default HomeView;
