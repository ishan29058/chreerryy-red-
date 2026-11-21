import type { MenuCategory, MenuItem } from '../data/menuData';

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

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
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
