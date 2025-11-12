const HomeView = {
    render: async () => {
        return `
        <section class="bg-grid relative flex flex-col justify-center items-center text-center" style="height: 90vh; overflow: hidden;">
          
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

          <div class="relative z-10 flex flex-col items-center p-4">
            
            <h1 class="h1-reveal-container">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--neon-violet)]">
                The AI Sparring Partner for Your Code
              </span>
              <span class="h1-comet-streak"></span>
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
                        Stop guessing. Our AI generates a comprehensive Jest test suite for your functions, finding bugs you've never seen.
                    </p>
                    <a href="#/app" data-link class="text-lg font-semibold">
                        Try the Test Generator &rarr;
                    </a>
                </div>
                
                <div class="phone-mockup">
                    <div class="phone-glow"></div>
                    <div class="phone-screen">
                        <h3 class="text-2xl text-slate-400">Vexor.AI</h3>
                        <p class="text-violet-400 mt-4">Connecting...</p>
                        <svg class="w-16 h-16 text-violet-400 animate-spin mt-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>

            </div>
        </section>

        <section class="py-32 hidden-anim">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                
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

        <section class="py-32 hidden-anim relative overflow-hidden">
            <div class="eclipse-graphic"></div>
            <div class="eclipse-glow"></div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <h2 class="text-center mb-12">Devs Love Vexor</h2>
              <div class="grid md:grid-cols-3 gap-8">
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
    },
    unmount: () => {
        console.log("Home view unmounted");
    }
};

export default HomeView;
