import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MENU_ITEMS, type MenuItem } from '../data/menuData';
import { filterMenuItems, formatCurrency } from '../utils/orderLogic';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectDish: (item: MenuItem) => void;
}

export function SearchModal({
  open,
  onClose,
  onSelectDish,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 60);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const results = filterMenuItems(MENU_ITEMS, 'All', query);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search café and restaurant menu"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl bg-[#F6F5F0] text-[#141416] rounded-2xl shadow-2xl overflow-hidden border border-black/10"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/10 bg-white">
              <Search className="w-5 h-5 text-[#141416]/50 shrink-0" />
              <label htmlFor="global-menu-search" className="sr-only">
                Search dishes and coffee
              </label>
              <input
                ref={inputRef}
                id="global-menu-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search espresso, truffle pasta, croissant..."
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-[#141416]/45"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-black/6"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-black/6">
              {results.length === 0 ? (
                <p className="p-8 text-center text-sm text-[#141416]/60">
                  No menu items found for &ldquo;{query}&rdquo;.
                </p>
              ) : (
                results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectDish(item);
                      onClose();
                    }}
                    className="w-full px-5 py-3.5 flex items-center justify-between gap-4 text-left hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[#E5E2D9]"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#141416] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#141416]/55 truncate tabular-nums">
                          {item.category} · {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-[#141416]/65 inline-flex items-center gap-1 shrink-0">
                      <span>Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
