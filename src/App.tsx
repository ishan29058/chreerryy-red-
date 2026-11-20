import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { AtmosphereReservation } from './components/AtmosphereReservation';
import { DishDetailModal } from './components/DishDetailModal';
import { Footer } from './components/Footer';
import { HeroShowcase } from './components/HeroShowcase';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { OrderBagDrawer } from './components/OrderBagDrawer';
import { SearchModal } from './components/SearchModal';
import {
  HERO_SLIDES,
  MENU_ITEMS,
  type DishOption,
  type MenuItem,
} from './data/menuData';
import {
  addItemToCart,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from './utils/orderLogic';

export default function App() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeSlide = HERO_SLIDES[activeSlideIndex] ?? HERO_SLIDES[0];
  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

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

  const handleAddToCart = useCallback(
    (item: MenuItem, option: DishOption, quantity = 1) => {
      setCart((prev) => addItemToCart(prev, item, option, quantity));
      showToast(`Added ${item.name} to order`);
    },
    [showToast]
  );

  const handleQuickAddByItem = useCallback(
    (item: MenuItem) => {
      handleAddToCart(item, item.options[0], 1);
    },
    [handleAddToCart]
  );

  const handleQuickAddById = useCallback(
    (menuItemId: string) => {
      const found = MENU_ITEMS.find((item) => item.id === menuItemId);
      if (found) {
        handleQuickAddByItem(found);
      }
    },
    [handleQuickAddByItem]
  );

  const handleInspectDishById = useCallback((menuItemId: string) => {
    const found = MENU_ITEMS.find((item) => item.id === menuItemId);
    if (found) {
      setSelectedDish(found);
    }
  }, []);

  const handleUpdateQty = useCallback((cartKey: string, delta: number) => {
    setCart((prev) => updateCartItemQuantity(prev, cartKey, delta));
  }, []);

  const handleRemoveItem = useCallback((cartKey: string) => {
    setCart((prev) => removeCartItem(prev, cartKey));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F0] text-[#141416]">
      <Navbar
        isLightHero={activeSlide.isLight}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        <HeroShowcase
          activeIndex={activeSlideIndex}
          onChangeIndex={setActiveSlideIndex}
          onInspectDish={handleInspectDishById}
          onQuickAdd={handleQuickAddById}
        />

        <MenuSection
          onSelectDish={setSelectedDish}
          onQuickAdd={handleQuickAddByItem}
        />

        <AtmosphereReservation />
      </main>

      <Footer />

      <DishDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      <OrderBagDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDish={setSelectedDish}
        onQuickAdd={handleQuickAddByItem}
      />

      {/* Non-blocking subtle confirmation toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#141416] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 text-xs font-medium"
          >
            <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
              <Check className="w-3 h-3" strokeWidth={2.5} />
            </span>
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => {
                setToastMessage(null);
                setCartOpen(true);
              }}
              className="ml-1 underline underline-offset-2 text-white/85 hover:text-white"
            >
              View Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
