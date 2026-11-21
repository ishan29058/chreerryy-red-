import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_ITEMS } from '../data/menuData';
import {
  filterMenuItems,
  formatCurrency,
  stepSlideIndex,
  wrapSlideIndex,
} from './orderLogic';

test('slide navigation wraps forward and backward seamlessly', () => {
  assert.equal(wrapSlideIndex(-1, 4), 3);
  assert.equal(wrapSlideIndex(4, 4), 0);
  assert.equal(stepSlideIndex(0, 4, 1), 1);
  assert.equal(stepSlideIndex(3, 4, 1), 0);
  assert.equal(stepSlideIndex(0, 4, -1), 3);
  assert.equal(stepSlideIndex(2, 4, -1), 1);
});

test('currency formatting displays fixed two-decimal presentation prices', () => {
  assert.equal(formatCurrency(7.5), '$7.50');
  assert.equal(formatCurrency(32), '$32.00');
  assert.equal(formatCurrency(18.5), '$18.50');
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
