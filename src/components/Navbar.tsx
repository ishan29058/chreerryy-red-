import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface NavbarProps {
  isLightHero: boolean;
  onOpenSearch: () => void;
}

const NAV_LINKS = [
  { label: 'Showcase', href: '#showcase' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#atmosphere' },
  { label: 'Visit Us', href: '#visit' },
];

export function Navbar({
  isLightHero,
  onOpenSearch,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const useDarkText = isScrolled || isLightHero;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        isScrolled
          ? 'bg-[#F6F5F0]/92 backdrop-blur-md border-b border-black/8 shadow-[0_1px_12px_rgba(0,0,0,0.04)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 h-[68px] flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#showcase"
          className={`font-display text-2xl sm:text-[26px] font-extrabold tracking-[0.14em] uppercase whitespace-nowrap shrink-0 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${
            useDarkText
              ? 'text-[#141416] focus-visible:outline-[#141416]'
              : 'text-white focus-visible:outline-white'
          }`}
        >
          AURORA
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                useDarkText
                  ? 'text-[#141416]/80 hover:text-[#141416] after:bg-[#141416] focus-visible:outline-[#141416]'
                  : 'text-white/85 hover:text-white after:bg-white focus-visible:outline-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Search */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search menu"
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              useDarkText
                ? 'text-[#141416] hover:bg-black/6 focus-visible:outline-[#141416]'
                : 'text-white hover:bg-white/12 focus-visible:outline-white'
            }`}
          >
            <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </button>

          <a
            href="#menu"
            className={`h-10 px-5 rounded-full inline-flex items-center justify-center text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              useDarkText
                ? 'bg-[#141416] text-white hover:bg-[#2A2A2E] focus-visible:outline-[#141416]'
                : 'bg-white text-[#141416] hover:bg-white/90 focus-visible:outline-white'
            }`}
          >
            Explore Menu
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className={`md:hidden h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              useDarkText
                ? 'text-[#141416] hover:bg-black/6'
                : 'text-white hover:bg-white/12'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#F6F5F0] text-[#141416] border-b border-black/10 px-6 py-5 shadow-lg"
          >
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-base font-medium text-[#141416] border-b border-black/6 last:border-none"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
