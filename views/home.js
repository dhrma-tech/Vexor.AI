const HomeView = {
    render: async () => {
        return `
        <section class="flex flex-col justify-center items-center text-center relative bg-grid" style="height: 90vh;">
            
            <div class="mb-4">
                <span class="text-2xl font-bold text-white">Vexor.AI</span>
            </div>

            <h1 class="text-4xl md:text-6xl font-bold mb-6 text-white">
                AI CODE SPARRING
            </h1>
            
            <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Forging robust code. Conquering edge cases.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#/sparring" data-link class="start-free-btn bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-[1.03] transition-transform">
                    Start Sparring Now
                </a>
                <button id="watch-demo-btn" class="secondary-btn bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-bold hover:scale-[1.03] hover:bg-white/5 transition-all">
                    Watch Demo
                </button>
            </div>
            
            <div class="absolute bottom-10 text-gray-400 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
        <section class="py-32 overflow-hidden">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                <div class="hidden-anim-left">
                    <h2 class="text-3xl font-bold text-white mb-4">Find Every Edge Case</h2>
                    <p class="text-lg text-gray-300 mb-6">
                        Stop guessing. Our AI generates a comprehensive Jest test suite for your functions, finding bugs you didn't know existed.
                    </p>
                    <a href="#/sparring" data-link class="text-blue-400 text-lg font-semibold hover:text-blue-300">
                        Try the Test Generator &rarr;
                    </a>
                </div>
                <div class="hidden-anim-right">
                    <div class="fake-code-editor">
<pre><code><span class="token-comment">// AI-generated tests will appear here...</span>

<span class="token-keyword">describe</span>(<span class="token-string">'example'</span>, () => {
  <span class="token-keyword">test</span>(<span class="token-string">'should return 3 for 1 + 2'</span>, () => {
    <span class="token-function">expect</span>(<span class="token-function">example</span>(<span class="token-number">1</span>, <span class="token-number">2</span>)).<span class="token-function">toBe</span>(<span class="token-number">3</span>);
  });

  <span class="token-keyword">test</span>(<span class="token-string">'should handle negative numbers'</span>, () => {
    <span class="token-function">expect</span>(<span class="token-function">example</span>(-<span class="token-number">1</span>, -<span class="token-number">1</span>)).<span class="token-function">toBe</span>(-<span class="token-number">2</span>);
  });

  <span class="token-keyword">test</span>(<span class="token-string">'should handle zero'</span>, () => {
    <span class="token-function">expect</span>(<span class="token-function">example</span>(<span class="token-number">0</span>, <span class="token-number">0</span>)).<span class="token-function">toBe</span>(<span class="token-number">0</span>);
  });
});</code></pre>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-32 overflow-hidden">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                <div class="hidden-anim-left">
                    <div class="bg-gray-800 p-6 rounded-lg shadow-2xl grid grid-cols-2 gap-4 text-center">
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <div class="text-5xl font-bold text-green-400">92</div>
                            <p class="text-gray-400 mt-2">Performance</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <div class="text-5xl font-bold text-green-400">100</div>
                            <p class="text-gray-400 mt-2">Accessibility</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <div class="text-5xl font-bold text-green-400">100</div>
                            <p class="text-gray-400 mt-2">Best Practices</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <div class="text-5xl font-bold text-amber-400">85</div>
                            <p class="text-gray-400 mt-2">SEO</p>
                        </div>
                    </div>
                </div>
                <div class="hidden-anim-right">
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

        <section class="py-32 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden-anim">
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
                    // Stop observing once it's visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the element is visible
        });

        // "Watch" all elements with the animation classes
        const hiddenElements = document.querySelectorAll('.hidden-anim, .hidden-anim-left, .hidden-anim-right');
        hiddenElements.forEach(el => observer.observe(el));
    },
    unmount: () => {
        console.log("Home view unmounted");
    }
};

export default HomeView;
