const HomeView = {
    render: async () => {
        return `
        <section class="relative flex flex-col justify-center items-center text-center overflow-hidden" style="height: 100vh;">
            
            <canvas id="hero-3d-canvas"></canvas>
            
            <div class="absolute top-0 left-0 w-full h-full bg-black z-2 opacity-40"></div>

            <div class="relative z-10 max-w-3xl mx-auto px-4 hero-content">
                <div class="mb-4">
                    <span class="text-2xl font-bold text-white">Vexor.AI</span>
                </div>
                <h1 class="text-4xl md:text-6xl font-bold mb-6 text-white">
                    AI CODE SPARRING
                </h1>
                <p class="text-xl text-gray-300 mb-8">
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
            </div>
            
            <div class="absolute bottom-10 z-10 text-gray-400 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
        <section class="py-32 overflow-hidden bg-grid">
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
<pre><code><span class="token-comment">// AI-generated tests...</span>
<span class="token-keyword">describe</span>(<span class="token-string">'example'</span>, () => {
  <span class="token-keyword">test</span>(<span class="token-string">'should return 3 for 1 + 2'</span>, () => {
    <span class="token-function">expect</span>(<span class="token-function">example</span>(<span class="token-number">1</span>, <span class="token-number">2</span>)).<span class="token-function">toBe</span>(<span class="token-number">3</span>);
  });
  <span class="token-keyword">test</span>(<span class="token-string">'should handle negative numbers'</span>, () => {
    <span class="token-function">expect</span>(<span class="token-function">example</span>(-<span class="token-number">1</span>, -<span class="token-number">1</span>)).<span class="token-function">toBe</span>(-<span class="token-number">2</span>);
  });
});</code></pre>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-32 overflow-hidden bg-grid">
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
                        Go beyond your code. Our Website Analyzer gives you a complete audit of any URL in seconds.
                    </p>
                    <a href="#/analyzer" data-link class="text-blue-400 text-lg font-semibold hover:text-blue-300">
                        Try the Website Analyzer &rarr;
                    </a>
                </div>
            </div>
        </section>
        `;
    },

    // Store Three.js variables here to access them in unmount
    three: {
        camera: null,
        scene: null,
        renderer: null,
        group: null,
        animationFrameId: null,
        mouseMoveListener: null,
        resizeListener: null
    },

    after_render: async () => {
        // --- GSAP Scrollytelling (for sections 2 and 3) ---
        gsap.registerPlugin(ScrollTrigger);
        const hiddenElements = document.querySelectorAll('.hidden-anim, .hidden-anim-left, .hidden-anim-right');
        hiddenElements.forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none", // Play once on enter
                },
                opacity: 0,
                y: el.classList.contains('hidden-anim-left') || el.classList.contains('hidden-anim-right') ? 0 : 20,
                x: el.classList.contains('hidden-anim-left') ? -30 : (el.classList.contains('hidden-anim-right') ? 30 : 0),
                duration: 0.7,
                ease: "power2.out",
                onComplete: () => {
                    el.classList.add('visible-anim'); // Use class to hold final state
                }
            });
        });

        // --- NEW: Three.js 3D Particle Background ---
        if (typeof THREE === 'undefined') {
            console.error("Three.js not loaded!");
            return;
        }

        const self = HomeView.three; // Reference to our storage
        let mouseX = 0, mouseY = 0;
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas) return;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        function init() {
            self.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
            self.camera.position.z = 1000;

            self.scene = new THREE.Scene();
            self.group = new THREE.Group();
            self.scene.add(self.group);

            // Use the purple color from your theme
            const particleColor = 0x9D00FF; // --neon-violet from style.css
            const material = new THREE.PointsMaterial({
                color: particleColor,
                size: 3,
                blending: THREE.AdditiveBlending,
                transparent: true,
                sizeAttenuation: true,
                opacity: 0.7
            });

            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 5000;
            const posArray = new Float32Array(particlesCount * 3);

            for (let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 2000; // x, y, z
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const particles = new THREE.Points(particlesGeometry, material);
            self.group.add(particles);

            self.renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: true // Make canvas transparent
            });
            self.renderer.setSize(window.innerWidth, window.innerHeight);
            self.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }

        self.resizeListener = () => {
            if (!self.renderer) return;
            self.camera.aspect = window.innerWidth / window.innerHeight;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        self.mouseMoveListener = (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.2;
            mouseY = (event.clientY - windowHalfY) * 0.2;
        };

        function animate() {
            self.animationFrameId = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.0001;
            if (self.group) {
                self.group.rotation.x = time * 0.2;
                self.group.rotation.y = time * 0.1;
            }

            self.camera.position.x += (mouseX - self.camera.position.x) * 0.05;
            self.camera.position.y += (-mouseY - self.camera.position.y) * 0.05;
            self.camera.lookAt(self.scene.position);
            self.renderer.render(self.scene, self.camera);
        }

        init();
        animate();

        window.addEventListener('resize', self.resizeListener);
        document.addEventListener('mousemove', self.mouseMoveListener);
    },
    
    unmount: () => {
        // Kill all GSAP ScrollTriggers
        ScrollTrigger.getAll().forEach(t => t.kill());
        
        // Stop Three.js animation and remove listeners
        const self = HomeView.three;
        if (self.animationFrameId) {
            cancelAnimationFrame(self.animationFrameId);
        }
        window.removeEventListener('resize', self.resizeListener);
        document.removeEventListener('mousemove', self.mouseMoveListener);

        // Optional: Full Three.js cleanup
        if (self.renderer) {
            self.renderer.dispose();
        }
        if (self.scene) {
            self.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (object.material.isMaterial) {
                        object.material.dispose();
                    }
                }
            });
        }

        // Clear references
        self.camera = null;
        self.scene = null;
        self.renderer = null;
        self.group = null;
        
        console.log("Home view unmounted, ScrollTriggers & 3D background stopped");
    }
};

export default HomeView;
