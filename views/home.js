const HomeView = {
    render: async () => {
        return `
        <!-- Hero section with grid and new SVG arc glow -->
        <section class="hero-grid relative flex flex-col justify-center items-center text-center" style="height: 90vh; overflow: hidden;">
          
          <!-- Glowing Arc SVG -->
          <svg
            viewBox="0 0 1000 300"
            preserveAspectRatio="xMidYMid meet"
            class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] z-0"
            style="pointer-events: none;"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 50,250 C 200,50 800,50 950,250"
              fill="none"
              stroke="#9D00FF"
              stroke-width="2.5"
              filter="url(#glow)"
              class="hero-arc-svg"
            />
          </svg>

          <!-- Hero Content (z-index 1) -->
          <div class="relative z-10 flex flex-col items-center p-4">
            <h1 class="relative animate-fade-in">
              The AI Sparring Partner for Your Code
              <!-- Light reveal animation -->
              <span class="h1-reveal-light"></span>
            </h1>
            <p class="text-xl text-slate-200 mt-6 mb-8 max-w-3xl mx-auto animate-fade-in-delay-1">
                Paste your functions. Get instant tests, refactors, and explanations. No setup, instant value.
            </p>
            <div class="flex gap-4 animate-fade-in-delay-2">
                <a href="#/app" data-link class="start-free-btn px-8 py-3">
                    Start Sparring Now
                </a>
                <button id="watch-demo-btn" class="secondary-btn px-8 py-3">
                    Watch Demo
                </button>
            </div>
            <div class="mt-20 text-gray-400 animate-bounce animate-fade-in-delay-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
          </div>
        </section>

        <section class="py-32 hidden-anim">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2>Find Every Edge Case</h2>
                    <p class="mt-4 mb-6">
                        Stop guessing. Our AI generates a comprehensive Jest test suite for your functions, finding bugs you didn't know existed.
                    </p>
                    <a href="#/app" data-link class="text-lg font-semibold">
                        Try the Test Generator &rarr;
                    </a>
                </div>
                <!-- Editor preview now wrapped in a glowing card -->
                <div class="glowing-card p-4">
                    <label class="block text-sm font-medium mb-2 text-gray-400">AI Generated Tests</label>
                    <div id="test-editor-preview" style="height: 300px;"></div>
                </div>
            </div>
        </section>

        <!-- "Analyze Any Website" section, restyled as "Stats" -->
        <section class="py-32 hidden-anim">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                
                <!-- NEW Digital Globe Stats Layout -->
                <div class="stats-container">
                    <div class="flex-shrink-0">
                      <div class="digital-globe"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-8 md:gap-12">
                      <div class="stats-text">
                        <div class="stats-number" style="color: #34d399;">92</div>
                        <div class="stats-label">Performance</div>
                      </div>
                      <div class="stats-text">
                        <div class="stats-number" style="color: #34d399;">100</div>
                        <div class="stats-label">Accessibility</div>
                      </div>
                      <div class="stats-text">
                        <div class="stats-number" style="color: #34d399;">100</div>
                        <div class="stats-label">Best Practices</div>
                      </div>
                      <div class="stats-text">
                        <div class="stats-number" style="color: #f59e0b;">85</div>
                        <div class="stats-label">SEO</div>
                      </div>
                    </div>
                </div>

                <div class="text-center md:text-left">
                    <h2>Analyze Any Website</h2>
                    <p class="mt-4 mb-6">
                        Go beyond your code. Our Website Analyzer, powered by Google PageSpeed, gives you a complete audit of any URL in seconds.
                    </p>
                    <a href="#/analyzer" data-link class="text-lg font-semibold">
                        Try the Website Analyzer &rarr;
                    </a>
                </div>
            </div>
        </section>

        <section class="py-32 hidden-anim">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-center mb-12">Devs Love Vexor</h2>
              <div class="grid md:grid-cols-3 gap-8">
                <!-- premium-card is now glowing-card via style.css -->
                <blockquote class="premium-card p-6">
                  <p class="mb-4">"Caught 15 edge cases I missed—game-changer for my side project."</p>
                  <cite class="font-semibold text-white not-italic">– Asmit, Indie Dev</cite>
                </blockquote>
                <blockquote class="premium-card p-6">
                  <p class="mb-4">"Simple, fast, and integrates perfectly with our CI pipeline."</p>
                  <cite class="font-semibold text-white not-italic">– Bhushan,Team Lead, Startup</cite>
                </blockquote>
                <blockquote class="premium-card p-6">
                  <p class="mb-4">"Like having an AI QA engineer on demand."</p>
                  <cite class="font-semibold text-white not-italic">– Marisha, Beginner Full-Stack Engineer</cite>
                </blockquote>
              </div>
            </div>
        </section>
        `;
    },
    after_render: async () => {
        // --- "Scrollytelling" JavaScript ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible-anim');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 
        });

        const hiddenElements = document.querySelectorAll('.hidden-anim');
        hiddenElements.forEach(el => observer.observe(el));

        // --- Monaco Editor Preview ---
        const previewCode = `
describe('example', () => {
  test('should return 3 for 1 + 2', () => {
    expect(example(1, 2)).toBe(3);
  });

  test('should handle negative numbers', () => {
    expect(example(-1, -1)).toBe(-2);
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
                minimap: { enabled: false },
                background: 'transparent' // Make editor bg transparent
            });
        });
    },
    unmount: () => {
        console.log("Home view unmounted");
    }
};

export default HomeView;
