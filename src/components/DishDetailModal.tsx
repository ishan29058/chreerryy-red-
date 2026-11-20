import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { DishOption, MenuItem } from '../data/menuData';
import { formatCurrency } from '../utils/orderLogic';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, option: DishOption, quantity: number) => void;
}

export function DishDetailModal({
  item,
  onClose,
  onAddToCart,
}: DishDetailModalProps) {
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedOptionIdx(0);
    setQuantity(1);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  const activeOption = item ? item.options[selectedOptionIdx] ?? item.options[0] : null;
  const lineTotal =
    item && activeOption ? (item.price + activeOption.priceDelta) * quantity : 0;

  return (
    <AnimatePresence>
      {item && activeOption && (
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

            {/* Dish Details & Contiguous Purchase Module */}
            <div className="md:col-span-7 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-[#141416]/55">
                  {item.category}
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                  {item.servingInfo}
                </p>

                <h3
                  id="dish-modal-title"
                  className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#141416] leading-tight"
                >
                  {item.name}
                </h3>

                <p className="mt-3 text-sm text-[#141416]/75 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-5 pt-4 border-t border-black/8 space-y-1.5 text-xs text-[#141416]/68">
                  <p>
                    <span className="font-semibold text-[#141416]">
                      Tasting Notes:
                    </span>{' '}
                    {item.tastingNotes}
                  </p>
                  <p>
                    <span className="font-semibold text-[#141416]">
                      Kitchen Note:
                    </span>{' '}
                    {item.pairing}
                  </p>
                </div>

                {/* Preparation / Option Selector */}
                <fieldset className="mt-6">
                  <legend className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141416]/65 mb-2.5">
                    Select Preparation
                  </legend>
                  <div className="space-y-2">
                    {item.options.map((opt, idx) => {
                      const selected = idx === selectedOptionIdx;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setSelectedOptionIdx(idx)}
                          aria-pressed={selected}
                          className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between text-sm transition-colors ${
                            selected
                              ? 'border-[#141416] bg-white font-semibold text-[#141416]'
                              : 'border-black/10 bg-white/50 text-[#141416]/75 hover:bg-white'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="tabular-nums text-xs text-[#141416]/65">
                            {opt.priceDelta > 0
                              ? `+${formatCurrency(opt.priceDelta)}`
                              : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              {/* Quantity + Add CTA */}
              <div className="mt-7 pt-5 border-t border-black/10 flex items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-black/15 bg-white px-1.5 h-11">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(item, activeOption, quantity);
                    onClose();
                  }}
                  className="flex-1 h-11 px-6 rounded-full bg-[#141416] text-white text-sm font-semibold hover:bg-[#7A1113] transition-colors flex items-center justify-between"
                >
                  <span>Add to Order</span>
                  <span className="tabular-nums">{formatCurrency(lineTotal)}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
