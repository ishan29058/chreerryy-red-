import { useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from '../data/menuData';
import { filterMenuItems, formatCurrency } from '../utils/orderLogic';

interface MenuSectionProps {
  onSelectDish: (item: MenuItem) => void;
}

export function MenuSection({ onSelectDish }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredItems = filterMenuItems(
    MENU_ITEMS,
    selectedCategory,
    searchQuery
  );

  return (
    <section
      id="menu"
      className="py-20 sm:py-28 bg-[#F6F5F0] text-[#141416]"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-black/8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#7A1113] mb-3">
              Curated All-Day Menu
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#141416] leading-[1.02]">
              Crafted from Morning Roasts to Evening Plates
            </h2>
          </div>

          {/* Inline Search Filter */}
          <div className="relative w-full lg:w-72">
            <label htmlFor="menu-inline-search" className="sr-only">
              Filter menu dishes
            </label>
            <Search className="w-4 h-4 text-[#141416]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="menu-inline-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter coffee, pasta, pastry..."
              className="w-full h-11 pl-10 pr-9 rounded-lg bg-white border border-black/10 text-sm text-[#141416] placeholder:text-[#141416]/45 focus:outline-none focus:ring-2 focus:ring-[#141416]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear menu filter"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#141416]/50 hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="mt-7 flex items-center gap-2 overflow-x-auto pb-2"
        >
          {MENU_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141416] ${
                  isActive
                    ? 'bg-[#141416] text-white'
                    : 'bg-black/[0.045] text-[#141416]/75 hover:bg-black/[0.08] hover:text-[#141416]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Menu Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="mt-14 py-16 text-center rounded-2xl bg-white border border-black/8">
            <p className="text-lg font-semibold text-[#141416]">
              No dishes match your filter
            </p>
            <p className="mt-1.5 text-sm text-[#141416]/60">
              Try clearing your search or switching back to all menu categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#141416] text-white text-xs font-semibold tracking-wide hover:bg-[#2A2A2E] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            data-testid="menu-grid"
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8"
          >
            {filteredItems.map((item) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-black/[0.06] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(20,20,22,0.07)]"
              >
                {/* Uniform 4:3 Image Frame */}
                <button
                  type="button"
                  onClick={() => onSelectDish(item)}
                  aria-label={`View details for ${item.name}`}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECEAE2] text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#141416]"
                >
                  {brokenImages[item.id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#E5E2D9] text-[#141416]/60 text-sm font-medium">
                      {item.name}
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenImages((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }))
                      }
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                </button>

                {/* Clean Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#141416]/55">
                    <span>{item.category}</span>
                    {item.featuredTag && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#7A1113] font-medium">
                          {item.featuredTag}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-2 flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-semibold text-[#141416] leading-snug">
                      <button
                        type="button"
                        onClick={() => onSelectDish(item)}
                        className="text-left hover:text-[#7A1113] transition-colors"
                      >
                        {item.name}
                      </button>
                    </h3>
                    <span className="text-[15px] font-semibold tabular-nums text-[#141416] shrink-0">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[#141416]/68 leading-relaxed line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-3">
                    <span className="text-xs text-[#141416]/52 truncate">
                      {item.servingInfo}
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelectDish(item)}
                      aria-label={`View tasting notes for ${item.name}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#141416] hover:text-[#7A1113] whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141416]"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
