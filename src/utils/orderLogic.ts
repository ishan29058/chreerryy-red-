import type { DishOption, MenuCategory, MenuItem } from '../data/menuData';

export type FulfillmentMode = 'pickup' | 'delivery';

export interface CartItem {
  cartKey: string;
  itemId: string;
  name: string;
  optionLabel: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  freeDeliveryRemaining: number;
}

export interface ReservationFormValues {
  guestName: string;
  email: string;
  date: string;
  timeSlot: string;
  partySize: number;
  seating: string;
  notes: string;
}

export interface ReservationValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ReservationFormValues, string>>;
}

export interface CheckoutFormValues {
  guestName: string;
  phone: string;
  address: string;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CheckoutFormValues, string>>;
}

export const TAX_RATE = 0.085;
export const DELIVERY_FEE = 4.5;
export const FREE_DELIVERY_THRESHOLD = 35;

export function wrapSlideIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

export function stepSlideIndex(
  current: number,
  total: number,
  direction: 1 | -1
): number {
  return wrapSlideIndex(current + direction, total);
}

export function buildCartKey(itemId: string, optionLabel: string): string {
  return `${itemId}::${optionLabel}`;
}

export function addItemToCart(
  cart: CartItem[],
  item: MenuItem,
  option: DishOption,
  quantity = 1
): CartItem[] {
  const safeQty = Math.max(1, Math.floor(quantity));
  const cartKey = buildCartKey(item.id, option.label);
  const unitPrice = roundCurrency(item.price + option.priceDelta);
  const existing = cart.find((entry) => entry.cartKey === cartKey);

  if (existing) {
    return cart.map((entry) =>
      entry.cartKey === cartKey
        ? { ...entry, quantity: entry.quantity + safeQty }
        : entry
    );
  }

  return [
    ...cart,
    {
      cartKey,
      itemId: item.id,
      name: item.name,
      optionLabel: option.label,
      unitPrice,
      quantity: safeQty,
      image: item.image,
    },
  ];
}

export function updateCartItemQuantity(
  cart: CartItem[],
  cartKey: string,
  delta: number
): CartItem[] {
  return cart
    .map((entry) =>
      entry.cartKey === cartKey
        ? { ...entry, quantity: entry.quantity + delta }
        : entry
    )
    .filter((entry) => entry.quantity > 0);
}

export function removeCartItem(cart: CartItem[], cartKey: string): CartItem[] {
  return cart.filter((entry) => entry.cartKey !== cartKey);
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function calculateCartTotals(
  cart: CartItem[],
  mode: FulfillmentMode
): CartTotals {
  const itemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = roundCurrency(
    cart.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0)
  );
  const qualifiesFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee =
    mode === 'delivery' && subtotal > 0 && !qualifiesFreeDelivery
      ? DELIVERY_FEE
      : 0;
  const tax = roundCurrency(subtotal * TAX_RATE);
  const total = roundCurrency(subtotal + deliveryFee + tax);
  const freeDeliveryRemaining =
    mode === 'delivery' && subtotal > 0 && !qualifiesFreeDelivery
      ? roundCurrency(FREE_DELIVERY_THRESHOLD - subtotal)
      : 0;

  return {
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    total,
    freeDeliveryRemaining,
  };
}

export function filterMenuItems(
  items: MenuItem[],
  category: MenuCategory,
  query: string
): MenuItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;
    const haystack = [
      item.name,
      item.category,
      item.description,
      item.tastingNotes,
      item.servingInfo,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function validateReservationForm(
  values: ReservationFormValues
): ReservationValidationResult {
  const errors: Partial<Record<keyof ReservationFormValues, string>> = {};

  if (!values.guestName.trim() || values.guestName.trim().length < 2) {
    errors.guestName = 'Please enter your full name.';
  }

  const emailTrimmed = values.email.trim();
  if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.date.trim()) {
    errors.date = 'Please select a reservation date.';
  }

  if (!values.timeSlot.trim()) {
    errors.timeSlot = 'Please select a dining time.';
  }

  if (values.partySize < 1 || values.partySize > 12) {
    errors.partySize = 'Party size must be between 1 and 12 guests.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCheckoutForm(
  values: CheckoutFormValues,
  mode: FulfillmentMode
): CheckoutValidationResult {
  const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

  if (!values.guestName.trim() || values.guestName.trim().length < 2) {
    errors.guestName = 'Please enter a name for the order.';
  }

  const digitsOnly = values.phone.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    errors.phone = 'Please enter a valid contact phone number.';
  }

  if (mode === 'delivery' && values.address.trim().length < 6) {
    errors.address = 'Please enter your street address for delivery.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateConfirmationCode(prefix: string, seedNumber: number): string {
  const numeric = 1000 + ((Math.abs(seedNumber) * 7919) % 8999);
  return `${prefix}-${numeric}`;
}
