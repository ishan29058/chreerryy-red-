import { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  calculateCartTotals,
  formatCurrency,
  generateConfirmationCode,
  validateCheckoutForm,
  type CartItem,
  type CheckoutFormValues,
  type FulfillmentMode,
} from '../utils/orderLogic';

interface OrderBagDrawerProps {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

interface OrderReceipt {
  code: string;
  guestName: string;
  mode: FulfillmentMode;
  total: number;
  itemCount: number;
}

export function OrderBagDrawer({
  open,
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: OrderBagDrawerProps) {
  const [mode, setMode] = useState<FulfillmentMode>('pickup');
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormValues>({
    guestName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormValues, string>>
  >({});
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  const totals = calculateCartTotals(cart, mode);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm(checkoutForm, mode);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const seed =
      checkoutForm.guestName.length * 19 +
      totals.itemCount * 41 +
      Math.round(totals.total);
    setReceipt({
      code: generateConfirmationCode('AUR', seed),
      guestName: checkoutForm.guestName.trim(),
      mode,
      total: totals.total,
      itemCount: totals.itemCount,
    });
    onClearCart();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-bag-heading"
          className="fixed inset-0 z-50 flex justify-end"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="relative z-10 w-full max-w-md bg-[#F6F5F0] text-[#141416] h-full shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.9} />
                <h2
                  id="order-bag-heading"
                  className="font-display text-2xl font-bold tracking-tight"
                >
                  Your Order
                </h2>
                <span className="text-xs font-medium text-[#141416]/55 tabular-nums">
                  ({totals.itemCount})
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close order bag"
                className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/6 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {receipt ? (
                <div
                  data-testid="order-confirmed-receipt"
                  className="py-10 text-center flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#141416] text-white flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7A1113]">
                    Order Confirmed
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold">
                    {receipt.code} — Preparing Now
                  </h3>
                  <p className="mt-2 text-sm text-[#141416]/70 max-w-xs">
                    Thank you, {receipt.guestName}. Your{' '}
                    {receipt.mode === 'pickup'
                      ? 'café counter pickup'
                      : 'courier delivery'}{' '}
                    order ({receipt.itemCount}{' '}
                    {receipt.itemCount === 1 ? 'item' : 'items'}) totaling{' '}
                    <strong className="tabular-nums text-[#141416]">
                      {formatCurrency(receipt.total)}
                    </strong>{' '}
                    is with our baristas and kitchen.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setReceipt(null);
                      onClose();
                    }}
                    className="mt-7 px-6 py-3 rounded-full bg-[#141416] text-white text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#7A1113] transition-colors"
                  >
                    Return to Menu
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-base font-semibold text-[#141416]">
                    Your order bag is empty
                  </p>
                  <p className="mt-1.5 text-sm text-[#141416]/60">
                    Explore our roasted espresso pairings and seasonal plates to
                    begin an order.
                  </p>
                  <a
                    href="#menu"
                    onClick={onClose}
                    className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#141416] text-white text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#7A1113] transition-colors"
                  >
                    Browse Menu
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Fulfillment Mode Switch */}
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/[0.06]">
                    <button
                      type="button"
                      onClick={() => setMode('pickup')}
                      aria-pressed={mode === 'pickup'}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                        mode === 'pickup'
                          ? 'bg-white text-[#141416] shadow-xs'
                          : 'text-[#141416]/65 hover:text-[#141416]'
                      }`}
                    >
                      Café Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('delivery')}
                      aria-pressed={mode === 'delivery'}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                        mode === 'delivery'
                          ? 'bg-white text-[#141416] shadow-xs'
                          : 'text-[#141416]/65 hover:text-[#141416]'
                      }`}
                    >
                      Local Delivery
                    </button>
                  </div>

                  {mode === 'delivery' && totals.freeDeliveryRemaining > 0 && (
                    <p className="text-xs text-[#141416]/68 bg-white px-3.5 py-2.5 rounded-xl border border-black/[0.07]">
                      Add{' '}
                      <span className="font-semibold tabular-nums text-[#141416]">
                        {formatCurrency(totals.freeDeliveryRemaining)}
                      </span>{' '}
                      more for complimentary courier delivery.
                    </p>
                  )}

                  {/* Cart Item List */}
                  <ul className="divide-y divide-black/8">
                    {cart.map((entry) => (
                      <li key={entry.cartKey} className="py-4 flex gap-3.5">
                        <img
                          src={entry.image}
                          alt={entry.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#E5E2D9]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-[#141416] truncate">
                              {entry.name}
                            </h3>
                            <span className="text-sm font-semibold tabular-nums shrink-0">
                              {formatCurrency(entry.unitPrice * entry.quantity)}
                            </span>
                          </div>
                          <p className="text-xs text-[#141416]/58 mt-0.5">
                            {entry.optionLabel}
                          </p>
                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-lg border border-black/12 bg-white">
                              <button
                                type="button"
                                onClick={() => onUpdateQty(entry.cartKey, -1)}
                                aria-label={`Decrease quantity of ${entry.name}`}
                                className="w-7 h-7 flex items-center justify-center hover:bg-black/5"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span
                                data-testid={`cart-qty-${entry.itemId}`}
                                className="w-7 text-center text-xs font-semibold tabular-nums"
                              >
                                {entry.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQty(entry.cartKey, 1)}
                                aria-label={`Increase quantity of ${entry.name}`}
                                className="w-7 h-7 flex items-center justify-center hover:bg-black/5"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(entry.cartKey)}
                              aria-label={`Remove ${entry.name} from order`}
                              className="p-1.5 text-[#141416]/45 hover:text-[#9E1928] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Totals Breakdown */}
                  <div className="pt-4 border-t border-black/10 space-y-2 text-sm">
                    <div className="flex justify-between text-[#141416]/70">
                      <span>Subtotal</span>
                      <span
                        data-testid="cart-subtotal"
                        className="tabular-nums font-medium"
                      >
                        {formatCurrency(totals.subtotal)}
                      </span>
                    </div>
                    {mode === 'delivery' && (
                      <div className="flex justify-between text-[#141416]/70">
                        <span>Courier Delivery</span>
                        <span className="tabular-nums font-medium">
                          {totals.deliveryFee === 0
                            ? 'Complimentary'
                            : formatCurrency(totals.deliveryFee)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#141416]/70">
                      <span>Estimated Tax (8.5%)</span>
                      <span className="tabular-nums font-medium">
                        {formatCurrency(totals.tax)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-black/10 flex justify-between text-base font-bold text-[#141416]">
                      <span>Total</span>
                      <span data-testid="cart-total" className="tabular-nums">
                        {formatCurrency(totals.total)}
                      </span>
                    </div>
                  </div>

                  {/* Guest Checkout Fields */}
                  <form
                    id="order-checkout-form"
                    onSubmit={handleCheckout}
                    noValidate
                    className="pt-2 space-y-3.5"
                  >
                    <div>
                      <label
                        htmlFor="checkout-name"
                        className="block text-xs font-semibold text-[#141416]/80 mb-1"
                      >
                        Guest Name
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        value={checkoutForm.guestName}
                        onChange={(e) =>
                          setCheckoutForm((prev) => ({
                            ...prev,
                            guestName: e.target.value,
                          }))
                        }
                        placeholder="Your name"
                        className="w-full h-10 px-3 rounded-xl bg-white border border-black/12 text-sm focus:outline-none focus:ring-2 focus:ring-[#141416]"
                      />
                      {errors.guestName && (
                        <p
                          role="alert"
                          className="mt-1 text-xs text-[#9E1928] font-medium"
                        >
                          {errors.guestName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-phone"
                        className="block text-xs font-semibold text-[#141416]/80 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        value={checkoutForm.phone}
                        onChange={(e) =>
                          setCheckoutForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="(212) 555-0148"
                        className="w-full h-10 px-3 rounded-xl bg-white border border-black/12 text-sm focus:outline-none focus:ring-2 focus:ring-[#141416]"
                      />
                      {errors.phone && (
                        <p
                          role="alert"
                          className="mt-1 text-xs text-[#9E1928] font-medium"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {mode === 'delivery' && (
                      <div>
                        <label
                          htmlFor="checkout-address"
                          className="block text-xs font-semibold text-[#141416]/80 mb-1"
                        >
                          Delivery Address
                        </label>
                        <input
                          id="checkout-address"
                          type="text"
                          value={checkoutForm.address}
                          onChange={(e) =>
                            setCheckoutForm((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          placeholder="128 Mercer Street, Apt 4B"
                          className="w-full h-10 px-3 rounded-xl bg-white border border-black/12 text-sm focus:outline-none focus:ring-2 focus:ring-[#141416]"
                        />
                        {errors.address && (
                          <p
                            role="alert"
                            className="mt-1 text-xs text-[#9E1928] font-medium"
                          >
                            {errors.address}
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full h-12 mt-2 rounded-full bg-[#141416] text-white text-xs font-semibold uppercase tracking-[0.1em] hover:bg-[#7A1113] transition-colors"
                    >
                      Place Order · {formatCurrency(totals.total)}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
