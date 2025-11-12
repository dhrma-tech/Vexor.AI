const PricingView = {
    render: async () => {
        // This is the HTML content from the old pricing.html <section>
        return `
        <section id="pricing" class="py-20 bg-transparent text-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-3xl font-bold text-center mb-12">Devs Love Vexor</h2>
              <div class="grid md:grid-cols-3 gap-8">
                <blockquote class="premium-card p-6">
                  <p class="text-slate-300 mb-4">"Caught 15 edge cases I missed—game-changer for my side project."</p>
                  <cite class="font-semibold text-white not-italic">– Asmit, Indie Dev</cite>
                </blockquote>
                <blockquote class="premium-card p-6">
                  <p class="text-slate-300 mb-4">"Simple, fast, and integrates perfectly with our CI pipeline."</p>
                  <cite class="font-semibold text-white not-italic">– Bhushan,Team Lead, Startup</cite>
                </blockquote>
                <blockquote class="premium-card p-6">
                  <p class="text-slate-300 mb-4">"Like having an AI QA engineer on demand."</p>
                  <cite class="font-semibold text-white not-italic">– Marisha, Beginner Full-Stack Engineer</cite>
                </blockquote>
              </div>
          </div>
        </section>
        `;
    },
    // No after_render or unmount needed for this static view
};

export default PricingView;
