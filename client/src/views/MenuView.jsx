import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../api';

export default function MenuView({ onSelectProduct }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(1500);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiFetch('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCategory) params.append('category', selectedCategory);
        if (sort) params.append('sort', sort);
        if (maxPrice) params.append('max_price', maxPrice);

        const data = await apiFetch(`/products?${params.toString()}`);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(loadProducts, 250);
    return () => clearTimeout(debounce);
  }, [search, selectedCategory, sort, maxPrice]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('popular');
    setMaxPrice(1500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Daily Hearth Selections</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
          Artisanal Bakery Catalogue
        </h1>
        <p className="text-sm text-ink-muted mt-2">
          Handcrafted daily with organic flour, cultured butter, and pure uncompromised passion.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-3xl p-5 border border-surface-border shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-light absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search croissants, sourdough, truffle cake, cupcakes..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-surface-border text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-surface-card"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <ArrowUpDown className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-10 pr-8 py-3 rounded-2xl border border-surface-border text-sm focus:outline-hidden focus:border-primary bg-surface-card appearance-none"
              >
                <option value="popular">Most Popular ★</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Fresh New Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Max Price Range Slider */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-surface-border/60">
          {/* Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === ''
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-card text-ink hover:bg-surface-warm'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c._id || c.category_id}
                onClick={() => setSelectedCategory(c._id || c.category_id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === (c._id || c.category_id)
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-card text-ink hover:bg-surface-warm'
                }`}
              >
                <span>{c.iconUrl}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted whitespace-nowrap">Max Price:</span>
            <input
              type="range"
              min="80"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 accent-primary"
            />
            <span className="text-xs font-bold text-ink min-w-[50px]">₹{maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-surface-card animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-surface-border max-w-md mx-auto space-y-3">
            <span className="text-4xl block">🔍</span>
            <h3 className="font-serif font-bold text-xl text-ink">No matching baked treats found</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Try adjusting your search keywords, price filter, or category selector.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.product_id || p._id}
                product={p}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
