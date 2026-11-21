export type MenuCategory =
  | 'All'
  | 'Specialty Coffee'
  | 'All-Day Kitchen'
  | 'Artisan Pastry'
  | 'Evening Plates';

export interface DishOption {
  label: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<MenuCategory, 'All'>;
  price: number;
  servingInfo: string;
  description: string;
  tastingNotes: string;
  pairing: string;
  image: string;
  featuredTag?: string;
  options: DishOption[];
}

export interface HeroSlide {
  id: string;
  menuItemId: string;
  headlineTop: string;
  headlineBottom: string;
  taglineLine1: string;
  taglineLine2: string;
  cardTitle: string;
  price: number;
  meta: string;
  image: string;
  bgHex: string;
  bgRadialHex: string;
  accentHex: string;
  isLight: boolean;
}

export const CAFE_INTERIOR_IMAGE =
  '/src/assets/images/cafe_interior_dining_1795214366592.jpg';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'crimson-cherry-espresso',
    name: 'Velvet Cherry Ristretto',
    shortName: 'Cherry Ristretto',
    category: 'Specialty Coffee',
    price: 7.5,
    servingInfo: 'Double Shot · 180 ml',
    description:
      'Double-extracted Ethiopian heirloom ristretto finished with silky steamed microfoam, dark cocoa dust, and a macerated Amarena cherry.',
    tastingNotes: 'Black cherry, dark cacao, toasted almond crema',
    pairing: 'Pairs with Valrhona dark chocolate sablé',
    image: '/src/assets/images/hero_crimson_espresso_1795214367360.jpg',
    featuredTag: 'House Signature',
    options: [
      { label: 'Whole Jersey Milk', priceDelta: 0 },
      { label: 'Barista Oat Milk', priceDelta: 0.75 },
      { label: 'Extra Ristretto Shot', priceDelta: 1.5 },
    ],
  },
  {
    id: 'alabaster-vanilla-latte',
    name: 'Vanilla Bean Oat & Croissant',
    shortName: 'Vanilla Oat Duo',
    category: 'Artisan Pastry',
    price: 13.0,
    servingInfo: 'Iced Latte & Butter Croissant',
    description:
      'Cold-infused Madagascar vanilla bean oat latte poured over hand-carved ice alongside our 48-hour cultured French butter croissant.',
    tastingNotes: 'Warm vanilla pod, caramelized laminated butter, sweet cream',
    pairing: 'Served warm from the morning deck oven',
    image: '/src/assets/images/hero_alabaster_latte_1795214377251.jpg',
    featuredTag: 'Morning Ritual',
    options: [
      { label: 'Iced Oat Latte', priceDelta: 0 },
      { label: 'Hot Latte', priceDelta: 0 },
      { label: 'Add Almond Cream Filling', priceDelta: 2.0 },
    ],
  },
  {
    id: 'obsidian-truffle-tagliolini',
    name: 'Black Truffle Tagliolini',
    shortName: 'Truffle Tagliolini',
    category: 'Evening Plates',
    price: 32.0,
    servingInfo: 'Fresh Egg Pasta · 36-Month Parmigiano',
    description:
      'Hand-cut forty-yolk tagliolini folded into a glossy cultured butter and aged Parmigiano emulsion, finished with shaved Périgord black truffle and chive oil.',
    tastingNotes: 'Earthy winter truffle, nutty aged cheese, delicate herb finish',
    pairing: 'Pairs with single-vineyard Barbaresco or sparkling mineral water',
    image: '/src/assets/images/hero_obsidian_truffle_1795214367579.jpg',
    featuredTag: 'Chef Selection',
    options: [
      { label: 'Classic Tasting Portion', priceDelta: 0 },
      { label: 'Extra Shaved Black Truffle (+5g)', priceDelta: 11.0 },
      { label: 'Gluten-Free Artisanal Pasta', priceDelta: 2.5 },
    ],
  },
  {
    id: 'chestnut-fig-brioche',
    name: 'Caramelized Fig Brioche',
    shortName: 'Fig Pain Perdu',
    category: 'All-Day Kitchen',
    price: 18.5,
    servingInfo: 'Warm Brioche · Whipped Mascarpone',
    description:
      'Thick-cut sourdough brioche seared in brown butter, crowned with Madagascar vanilla mascarpone, honey-roasted black mission figs, toasted Piedmont hazelnuts, and espresso caramel.',
    tastingNotes: 'Toasted hazelnut, roasted fig jam, smoky espresso glaze',
    pairing: 'Pairs with Ethiopian Guji Pour-Over',
    image: '/src/assets/images/hero_chestnut_brioche_1795214366392.jpg',
    featuredTag: 'All-Day Favorite',
    options: [
      { label: 'Classic Espresso Caramel', priceDelta: 0 },
      { label: 'Add Warm Smoked Maple', priceDelta: 2.0 },
      { label: 'Side of Crispy Pancetta', priceDelta: 4.5 },
    ],
  },
  {
    id: 'cured-salmon-tartine',
    name: 'House-Cured Salmon Tartine',
    shortName: 'Salmon Tartine',
    category: 'All-Day Kitchen',
    price: 21.0,
    servingInfo: 'Country Sourdough · Lemon Dill',
    description:
      'Char-grilled natural levain topped with citrus-cured gravlax salmon, whipped Meyer lemon crème fraîche, crispy fried capers, shaved fennel, and garden dill.',
    tastingNotes: 'Bright citrus zest, silky cured salmon, briny crunch',
    pairing: 'Pairs with chilled crisp Sauvignon Blanc or iced matcha',
    image: '/src/assets/images/menu_salmon_tartine_1795214368975.jpg',
    options: [
      { label: 'Country Levain Sourdough', priceDelta: 0 },
      { label: 'Add Soft-Poached Farm Egg', priceDelta: 3.0 },
      { label: 'Seeded Rye Bread', priceDelta: 0 },
    ],
  },
  {
    id: 'ethiopian-pourover',
    name: 'Ethiopia Guji Pour-Over',
    shortName: 'Guji Pour-Over',
    category: 'Specialty Coffee',
    price: 9.0,
    servingInfo: 'Hand Brewed · 300 ml Carafe',
    description:
      'Light-roasted washed micro-lot from Guji Highland, brewed to order through handmade ceramic dripper for luminous clarity and tea-like elegance.',
    tastingNotes: 'Bergamot blossom, white peach, ruby hibiscus',
    pairing: 'Served in borosilicate server with crystal tasting tumbler',
    image: '/src/assets/images/menu_pourover_coffee_1795214371202.jpg',
    featuredTag: 'Micro-Lot',
    options: [
      { label: 'Served Hot (Carafe)', priceDelta: 0 },
      { label: 'Flash-Chilled Over Ice', priceDelta: 0.5 },
      { label: 'Take-Home 250g Whole Beans', priceDelta: 19.0 },
    ],
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-crimson',
    menuItemId: 'crimson-cherry-espresso',
    headlineTop: 'VELVET',
    headlineBottom: 'RISTRETTO',
    taglineLine1: 'Slow roasted.',
    taglineLine2: 'Silky crema finish.',
    cardTitle: 'Velvet Cherry Ristretto',
    price: 7.5,
    meta: 'Specialty Coffee · Double Shot',
    image: '/src/assets/images/hero_crimson_espresso_1795214367360.jpg',
    bgHex: '#63101B',
    bgRadialHex: '#7D1725',
    accentHex: '#FFFFFF',
    isLight: false,
  },
  {
    id: 'slide-alabaster',
    menuItemId: 'alabaster-vanilla-latte',
    headlineTop: 'VANILLA',
    headlineBottom: 'OAT & FLAKY',
    taglineLine1: 'Cold infused.',
    taglineLine2: 'Baked fresh at dawn.',
    cardTitle: 'Vanilla Oat & Croissant',
    price: 13.0,
    meta: 'Artisan Pastry · Morning Pairing',
    image: '/src/assets/images/hero_alabaster_latte_1795214377251.jpg',
    bgHex: '#ECEAE1',
    bgRadialHex: '#F3F1E9',
    accentHex: '#141416',
    isLight: true,
  },
  {
    id: 'slide-obsidian',
    menuItemId: 'obsidian-truffle-tagliolini',
    headlineTop: 'BLACK',
    headlineBottom: 'TRUFFLE',
    taglineLine1: 'Handmade daily.',
    taglineLine2: 'Périgord winter harvest.',
    cardTitle: 'Black Truffle Tagliolini',
    price: 32.0,
    meta: 'Evening Plates · Fresh Pasta',
    image: '/src/assets/images/hero_obsidian_truffle_1795214367579.jpg',
    bgHex: '#101213',
    bgRadialHex: '#1A1D1F',
    accentHex: '#FFFFFF',
    isLight: false,
  },
  {
    id: 'slide-chestnut',
    menuItemId: 'chestnut-fig-brioche',
    headlineTop: 'ROASTED',
    headlineBottom: 'FIG BRIOCHE',
    taglineLine1: 'Seared in brown butter.',
    taglineLine2: 'Espresso caramel glaze.',
    cardTitle: 'Caramelized Fig Brioche',
    price: 18.5,
    meta: 'All-Day Kitchen · Warm Tartine',
    image: '/src/assets/images/hero_chestnut_brioche_1795214366392.jpg',
    bgHex: '#331E14',
    bgRadialHex: '#43281A',
    accentHex: '#FDFBF7',
    isLight: false,
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Specialty Coffee',
  'All-Day Kitchen',
  'Artisan Pastry',
  'Evening Plates',
];

