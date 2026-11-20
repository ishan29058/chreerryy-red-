import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { HERO_SLIDES, type HeroSlide } from '../data/menuData';
import { formatCurrency, stepSlideIndex } from '../utils/orderLogic';

interface HeroShowcaseProps {
  activeIndex: number;
  onChangeIndex: (nextIndex: number) => void;
  onInspectDish: (menuItemId: string) => void;
  onQuickAdd: (menuItemId: string) => void;
}

export function HeroShowcase({
  activeIndex,
  onChangeIndex,
  onInspectDish,
  onQuickAdd,
}: HeroShowcaseProps) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const activeSlide: HeroSlide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  // Smooth spring-damped subtle parallax on desktop pointer movement
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const parallaxX = useSpring(rawX, { stiffness: 120, damping: 24 });
  const parallaxY = useSpring(rawY, { stiffness: 120, damping: 24 });

  const handleSelectSlide = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex) return;
      const forwardDist =
        (targetIndex - activeIndex + HERO_SLIDES.length) % HERO_SLIDES.length;
      const dir: 1 | -1 = forwardDist <= HERO_SLIDES.length / 2 ? 1 : -1;
      setDirection(dir);
      onChangeIndex(targetIndex);
    },
    [activeIndex, onChangeIndex]
  );

  const handleStep = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      onChangeIndex(stepSlideIndex(activeIndex, HERO_SLIDES.length, dir));
    },
    [activeIndex, onChangeIndex]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (event.key === 'ArrowRight') {
        handleStep(1);
      } else if (event.key === 'ArrowLeft') {
        handleStep(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleStep]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(relX * -22);
    rawY.set(relY * -16);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const isLight = activeSlide.isLight;
  const primaryTextClass = isLight ? 'text-[#141416]' : 'text-white';
  const secondaryTextClass = isLight ? 'text-[#141416]/72' : 'text-white/78';
  const mutedTextClass = isLight ? 'text-[#141416]/55' : 'text-white/60';

  return (
    <section
      id="showcase"
      data-testid="hero-showcase"
      data-active-slide={activeSlide.id}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        backgroundColor: activeSlide.bgHex,
        backgroundImage: `radial-gradient(circle at 56% 46%, ${activeSlide.bgRadialHex} 0%, ${activeSlide.bgHex} 62%)`,
      }}
      className="relative min-h-screen lg:h-screen lg:min-h-[760px] lg:max-h-[980px] w-full overflow-hidden flex flex-col justify-between transition-[background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pt-[76px] pb-6 sm:pb-8"
    >
      {/* Subtle architectural vignette ring for sculptural studio depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: isLight
            ? 'radial-gradient(circle at 55% 46%, rgba(255,255,255,0.55) 0%, rgba(20,20,22,0.03) 65%, rgba(20,20,22,0.08) 100%)'
            : 'radial-gradient(circle at 55% 46%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.04) 55%, rgba(0,0,0,0.34) 100%)',
        }}
      />

      {/* Main Stage Grid */}
      <div className="relative z-10 flex-1 max-w-[1380px] w-full mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4">
        {/* Left Column: Kinetic Editorial Typography & Primary CTA */}
        <div className="lg:col-span-5 flex flex-col items-start justify-center pt-4 lg:pt-0 z-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSlide.id}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 22 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -18 }
              }
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <p
                className={`text-xs sm:text-[13px] font-medium tracking-[0.06em] mb-3 ${mutedTextClass}`}
              >
                {activeSlide.meta}
              </p>

              <h1
                data-testid="hero-headline"
                className={`font-display italic font-extrabold uppercase tracking-[-0.01em] leading-[0.9] text-[clamp(3.35rem,5.8vw,5.4rem)] ${primaryTextClass}`}
              >
                <span className="block">{activeSlide.headlineTop}</span>
                <span className="block">{activeSlide.headlineBottom}</span>
              </h1>

              <div
                className={`mt-5 text-base sm:text-lg leading-snug font-normal ${secondaryTextClass}`}
              >
                <p>{activeSlide.taglineLine1}</p>
                <p>{activeSlide.taglineLine2}</p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => onInspectDish(activeSlide.menuItemId)}
                  className={`group inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-xs sm:text-[13px] font-bold tracking-[0.1em] uppercase whitespace-nowrap shrink-0 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    isLight
                      ? 'bg-[#141416] text-white hover:bg-[#26262A] focus-visible:outline-[#141416]'
                      : 'bg-white text-[#141416] hover:bg-white/92 focus-visible:outline-white'
                  }`}
                >
                  <span>Order Now</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={2.2}
                  />
                </button>

                <span
                  className={`text-lg font-semibold tabular-nums ${primaryTextClass}`}
                >
                  {formatCurrency(activeSlide.price)}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center Stage: Floating Studio Culinary Subject */}
        <div className="lg:col-span-6 relative flex items-center justify-center h-[320px] sm:h-[420px] lg:h-[540px] select-none">
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            className="relative w-[300px] h-[300px] sm:w-[410px] sm:h-[410px] lg:w-[510px] lg:h-[510px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={activeSlide.id}
                custom={direction}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        x: direction * 72,
                        scale: 0.88,
                        rotate: direction * -7,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 220,
                    damping: 25,
                    mass: 0.85,
                  },
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.15 } }
                    : {
                        opacity: 0,
                        x: direction * -72,
                        scale: 0.88,
                        rotate: direction * 7,
                        transition: {
                          duration: 0.2,
                          ease: [0.4, 0, 1, 1],
                        },
                      }
                }
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full h-full flex items-center justify-center animate-subtle-float">
                  {imageErrorMap[activeSlide.id] ? (
                    <div
                      className={`w-[78%] h-[78%] rounded-full flex flex-col items-center justify-center border ${
                        isLight
                          ? 'bg-black/5 border-black/10 text-[#141416]'
                          : 'bg-white/8 border-white/15 text-white'
                      }`}
                    >
                      <span className="font-display text-2xl font-bold uppercase tracking-wider">
                        {activeSlide.cardTitle}
                      </span>
                      <span className="text-xs mt-1 opacity-70">
                        {activeSlide.meta}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={activeSlide.image}
                      alt={activeSlide.cardTitle}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setImageErrorMap((prev) => ({
                          ...prev,
                          [activeSlide.id]: true,
                        }))
                      }
                      className="w-full h-full object-contain hero-studio-mask pointer-events-none"
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Edge Rail: Vertical Slide Pagination (Matching Reference Video) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-end justify-center gap-3 z-20">
          <div
            role="tablist"
            aria-label="Signature dishes showcase"
            className="flex flex-col items-center gap-3"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${slide.cardTitle}`}
                  onClick={() => handleSelectSlide(idx)}
                  className="group p-1.5 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? isLight
                          ? 'w-2 h-8 bg-[#141416]'
                          : 'w-2 h-8 bg-white'
                        : isLight
                          ? 'w-2 h-2 bg-[#141416]/30 group-hover:bg-[#141416]/60'
                          : 'w-2 h-2 bg-white/35 group-hover:bg-white/70'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span
            className={`mt-2 text-[11px] font-semibold tabular-nums tracking-widest ${mutedTextClass}`}
          >
            0{activeIndex + 1} / 0{HERO_SLIDES.length}
          </span>
        </div>
      </div>

      {/* Bottom Interactive Dock: Left Hours + Right Signature Dish Switcher Strip */}
      <div className="relative z-20 max-w-[1380px] w-full mx-auto px-5 sm:px-8 lg:px-12 mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Bottom Left: Clean Single-Line Venue Info */}
        <div className="hidden sm:flex items-center gap-4 shrink-0 whitespace-nowrap">
          <div className={`text-xs ${mutedTextClass}`}>
            <span className={`font-semibold ${primaryTextClass}`}>
              Open Daily
            </span>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span>07:30 – 22:30</span>
          </div>
          <a
            href="#reservations"
            className={`text-xs font-semibold underline underline-offset-4 whitespace-nowrap transition-opacity hover:opacity-75 ${primaryTextClass}`}
          >
            Book a Table
          </a>
        </div>

        {/* Bottom Right: Signature Card Switcher Carousel */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full lg:flex-1 lg:max-w-[920px] min-w-0">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            aria-label="Previous signature dish"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full shrink-0 flex items-center justify-center border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isLight
                ? 'border-[#141416]/20 text-[#141416] hover:bg-[#141416]/8 focus-visible:outline-[#141416]'
                : 'border-white/25 text-white hover:bg-white/12 focus-visible:outline-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 flex-1 min-w-0">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={slide.id}
                  className={`relative min-w-0 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? isLight
                        ? 'bg-[#141416]/10 ring-1 ring-[#141416]/45 shadow-md -translate-y-1'
                        : 'bg-white/18 ring-1 ring-white/55 shadow-lg -translate-y-1'
                      : isLight
                        ? 'bg-[#141416]/5 hover:bg-[#141416]/8 border border-[#141416]/10'
                        : 'bg-white/8 hover:bg-white/14 border border-white/12'
                  } backdrop-blur-md`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectSlide(idx)}
                    aria-label={`Select ${slide.cardTitle}, ${formatCurrency(slide.price)}`}
                    aria-pressed={isActive}
                    className="w-full text-left p-2 sm:p-2.5 pr-9 flex items-center gap-2 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 bg-black/15">
                      <img
                        src={slide.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-semibold truncate ${primaryTextClass}`}
                      >
                        {slide.cardTitle}
                      </p>
                      <p
                        className={`text-xs tabular-nums mt-0.5 font-medium ${secondaryTextClass}`}
                      >
                        {formatCurrency(slide.price)}
                      </p>
                    </div>
                  </button>

                  {/* Quick Add-to-Bag Icon Button (Sibling to prevent nested button HTML) */}
                  <button
                    type="button"
                    onClick={() => onQuickAdd(slide.menuItemId)}
                    aria-label={`Quick add ${slide.cardTitle} to order bag`}
                    className={`absolute right-2 bottom-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isLight
                        ? 'bg-[#141416] text-white hover:bg-[#2B2B30] focus-visible:outline-[#141416]'
                        : 'bg-white text-[#141416] hover:bg-white/90 focus-visible:outline-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleStep(1)}
            aria-label="Next signature dish"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full shrink-0 flex items-center justify-center border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isLight
                ? 'border-[#141416]/20 text-[#141416] hover:bg-[#141416]/8 focus-visible:outline-[#141416]'
                : 'border-white/25 text-white hover:bg-white/12 focus-visible:outline-white'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
