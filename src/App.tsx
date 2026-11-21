import { useCallback, useEffect, useState } from 'react';
import { AtmosphereReservation } from './components/AtmosphereReservation';
import { DishDetailModal } from './components/DishDetailModal';
import { Footer } from './components/Footer';
import { HeroShowcase } from './components/HeroShowcase';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { HERO_SLIDES, MENU_ITEMS, type MenuItem } from './data/menuData';

export default function App() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const activeSlide = HERO_SLIDES[activeSlideIndex] ?? HERO_SLIDES[0];

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleInspectDishById = useCallback((menuItemId: string) => {
    const found = MENU_ITEMS.find((item) => item.id === menuItemId);
    if (found) {
      setSelectedDish(found);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F0] text-[#141416]">
      <Navbar
        isLightHero={activeSlide.isLight}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        <HeroShowcase
          activeIndex={activeSlideIndex}
          onChangeIndex={setActiveSlideIndex}
          onInspectDish={handleInspectDishById}
        />

        <MenuSection onSelectDish={setSelectedDish} />

        <AtmosphereReservation />
      </main>

      <Footer />

      <DishDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDish={setSelectedDish}
      />
    </div>
  );
}
