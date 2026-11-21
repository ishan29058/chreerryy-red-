export function Footer() {
  return (
    <footer className="bg-[#141416] text-white/80 py-14 border-t border-white/10">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <a
            href="#showcase"
            className="font-display text-2xl font-extrabold tracking-[0.14em] uppercase text-white"
          >
            AURORA
          </a>
          <p className="mt-3 text-sm text-white/60 max-w-sm leading-relaxed">
            Specialty micro-lot roastery, morning bakery, and seasonal evening
            kitchen in the heart of Mercer Street.
          </p>
        </div>

        <div className="md:col-span-4 text-sm space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white mb-2.5">
            Hours &amp; Location
          </p>
          <p className="text-white/70">42 Rue de Mercer, Suite 100 · SoHo, NY</p>
          <p className="text-white/70">Coffee Bar: Daily 07:30 – 17:00</p>
          <p className="text-white/70">Evening Kitchen: Tue – Sun 17:30 – 22:30</p>
          <p className="text-white/70 tabular-nums">(212) 555-0148 · hello@auroracafe.example</p>
        </div>

        <div className="md:col-span-3 text-sm flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white mb-1">
            Explore
          </p>
          <a href="#showcase" className="text-white/70 hover:text-white transition-colors">
            Signature Showcase
          </a>
          <a href="#menu" className="text-white/70 hover:text-white transition-colors">
            All-Day Menu
          </a>
          <a href="#atmosphere" className="text-white/70 hover:text-white transition-colors">
            About &amp; Dining Room
          </a>
          <a href="#visit" className="text-white/70 hover:text-white transition-colors">
            Hours &amp; Location
          </a>
        </div>
      </div>

      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
        <p>© 2026 Aurora Café &amp; Kitchen. All rights reserved.</p>
        <p>Crafted hospitality · Direct-trade coffee &amp; seasonal table</p>
      </div>
    </footer>
  );
}
