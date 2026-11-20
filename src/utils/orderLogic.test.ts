import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_ITEMS } from '../data/menuData';
import {
  addItemToCart,
  calculateCartTotals,
  filterMenuItems,
  generateConfirmationCode,
  removeCartItem,
  stepSlideIndex,
  updateCartItemQuantity,
  validateCheckoutForm,
  validateReservationForm,
} from './orderLogic';

test('slide navigation wraps forward and backward seamlessly', () => {
  assert.equal(stepSlideIndex(0, 4, 1), 1);
  assert.equal(stepSlideIndex(3, 4, 1), 0);
  assert.equal(stepSlideIndex(0, 4, -1), 3);
  assert.equal(stepSlideIndex(2, 4, -1), 1);
});

test('cart merges identical item + option and separates distinct options', () => {
  const espresso = MENU_ITEMS[0];
  let cart = addItemToCart([], espresso, espresso.options[0], 1);
  cart = addItemToCart(cart, espresso, espresso.options[0], 2);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);
  assert.equal(cart[0].unitPrice, 7.5);

  cart = addItemToCart(cart, espresso, espresso.options[1], 1);
  assert.equal(cart.length, 2);
  assert.equal(cart[1].unitPrice, 8.25);
});

test('cart quantity updates remove items when reaching zero', () => {
  const pasta = MENU_ITEMS[2];
  let cart = addItemToCart([], pasta, pasta.options[0], 2);
  const key = cart[0].cartKey;

  cart = updateCartItemQuantity(cart, key, -1);
  assert.equal(cart[0].quantity, 1);

  cart = updateCartItemQuantity(cart, key, -1);
  assert.equal(cart.length, 0);

  cart = addItemToCart(cart, pasta, pasta.options[0], 1);
  cart = removeCartItem(cart, cart[0].cartKey);
  assert.equal(cart.length, 0);
});

test('cart totals calculate tax and free delivery threshold accurately', () => {
  const espresso = MENU_ITEMS[0]; // $7.50
  const pasta = MENU_ITEMS[2]; // $32.00

  const smallCart = addItemToCart([], espresso, espresso.options[0], 2); // $15.00
  const pickupTotals = calculateCartTotals(smallCart, 'pickup');
  assert.equal(pickupTotals.itemCount, 2);
  assert.equal(pickupTotals.subtotal, 15);
  assert.equal(pickupTotals.deliveryFee, 0);
  assert.equal(pickupTotals.tax, 1.28);
  assert.equal(pickupTotals.total, 16.28);

  const deliveryTotals = calculateCartTotals(smallCart, 'delivery');
  assert.equal(deliveryTotals.deliveryFee, 4.5);
  assert.equal(deliveryTotals.freeDeliveryRemaining, 20);
  assert.equal(deliveryTotals.total, 20.78);

  const largeCart = addItemToCart(smallCart, pasta, pasta.options[0], 1); // $47.00
  const freeDeliveryTotals = calculateCartTotals(largeCart, 'delivery');
  assert.equal(freeDeliveryTotals.deliveryFee, 0);
  assert.equal(freeDeliveryTotals.freeDeliveryRemaining, 0);
});

test('menu filtering respects category and search terms', () => {
  const coffeeOnly = filterMenuItems(MENU_ITEMS, 'Specialty Coffee', '');
  assert.equal(coffeeOnly.length, 2);
  assert.ok(coffeeOnly.every((item) => item.category === 'Specialty Coffee'));

  const truffleSearch = filterMenuItems(MENU_ITEMS, 'All', 'truffle');
  assert.equal(truffleSearch.length, 1);
  assert.equal(truffleSearch[0].id, 'obsidian-truffle-tagliolini');

  const noMatch = filterMenuItems(MENU_ITEMS, 'Evening Plates', 'croissant');
  assert.equal(noMatch.length, 0);
});

test('reservation and checkout validations reject missing or malformed input', () => {
  const invalidRes = validateReservationForm({
    guestName: '',
    email: 'invalid-email',
    date: '',
    timeSlot: '',
    partySize: 0,
    seating: 'Main Dining Room',
    notes: '',
  });
  assert.equal(invalidRes.isValid, false);
  assert.ok(invalidRes.errors.guestName);
  assert.ok(invalidRes.errors.email);
  assert.ok(invalidRes.errors.date);
  assert.ok(invalidRes.errors.timeSlot);
  assert.ok(invalidRes.errors.partySize);

  const validRes = validateReservationForm({
    guestName: 'Elena Vance',
    email: 'elena@example.com',
    date: '2026-11-25',
    timeSlot: '07:00 PM',
    partySize: 4,
    seating: 'Main Dining Room',
    notes: 'Window seat if available',
  });
  assert.equal(validRes.isValid, true);

  const invalidDelivery = validateCheckoutForm(
    { guestName: 'Sam', phone: '555-1234', address: '' },
    'delivery'
  );
  assert.equal(invalidDelivery.isValid, false);
  assert.ok(invalidDelivery.errors.address);

  const validPickup = validateCheckoutForm(
    { guestName: 'Sam', phone: '555-1234', address: '' },
    'pickup'
  );
  assert.equal(validPickup.isValid, true);
});

test('confirmation code generator produces deterministic formatted codes', () => {
  assert.match(generateConfirmationCode('AUR', 42), /^AUR-\d{4}$/);
  assert.equal(
    generateConfirmationCode('RES', 100),
    generateConfirmationCode('RES', 100)
  );
});
