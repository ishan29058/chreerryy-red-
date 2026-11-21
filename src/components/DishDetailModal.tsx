import { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { MenuItem } from '../data/menuData';
import { formatCurrency } from '../utils/orderLogic';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dish-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-3xl bg-[#F6F5F0] text-[#141416] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dish details"
              className="absolute right-4 top-4 z-20 h-9 w-9 rounded-full bg-white/90 text-[#141416] flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Dish Photography */}
            <div className="md:col-span-5 bg-[#E6E3DA] min-h-[240px] md:min-h-full">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Presentation Details */}
            <div className="md:col-span-7 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-[#141416]/55">
                  {item.category}
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                  {item.servingInfo}
                </p>

                <div className="mt-2 flex items-baseline justify-between gap-4 pr-8">
                  <h3
                    id="dish-modal-title"
                    className="font-display text-3xl sm:text-4xl font-bold text-[#141416] leading-tight"
                  >
                    {item.name}
                  </h3>
                  <span className="text-lg font-semibold tabular-nums text-[#141416] shrink-0">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                <p className="mt-3 text-sm text-[#141416]/75 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-5 pt-4 border-t border-black/8 space-y-2 text-xs text-[#141416]/70">
                  <p>
                    <span className="font-semibold text-[#141416]">
                      Tasting Notes:
                    </span>{' '}
                    {item.tastingNotes}
                  </p>
                  <p>
                    <span className="font-semibold text-[#141416]">
                      Kitchen Pairing:
                    </span>{' '}
                    {item.pairing}
                  </p>
                </div>

                {/* Static Preparation Styles */}
                <div className="mt-6 pt-5 border-t border-black/8">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141416]/60 mb-3">
                    House Preparations
                  </p>
                  <ul className="divide-y divide-black/6 border-y border-black/6">
                    {item.options.map((opt) => (
                      <li
                        key={opt.label}
                        className="py-2.5 flex items-center justify-between text-sm text-[#141416]/82"
                      >
                        <span>{opt.label}</span>
                        <span className="tabular-nums text-xs text-[#141416]/55">
                          {opt.priceDelta > 0
                            ? `+${formatCurrency(opt.priceDelta)}`
                            : 'House Standard'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 pt-5 border-t border-black/10 flex items-center justify-between gap-4">
                <p className="text-xs text-[#141416]/58">
                  Prepared fresh to order in our dining room.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-6 rounded-full bg-[#141416] text-white text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#7A1113] transition-colors shrink-0"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
