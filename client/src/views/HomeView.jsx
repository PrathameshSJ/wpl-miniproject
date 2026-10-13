import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, Gamepad2, Award, Truck, ShieldCheck, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { apiFetch, getImageUrl } from '../api';

export default function HomeView({ setActiveTab, onSelectProduct }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catsData, prodsData, revsData] = await Promise.all([
          apiFetch('/categories'),
          apiFetch('/products?limit=8'),
          apiFetch('/reviews?top=1'),
        ]);

        setCategories(catsData || []);
        setProducts(prodsData.products || []);
        setReviews(revsData || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleCategorySelect = async (catId) => {
    setSelectedCategory(catId);
    try {
      const url = catId ? `/products?category=${catId}&limit=8` : '/products?limit=8';
      const data = await apiFetch(url);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Category filter failed:', err);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3D2214] via-[#2C1810] to-[#1E0F0A] text-white p-8 sm:p-12 lg:p-20 shadow-2xl border border-amber-900/40">
        {/* Ambient warm glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-accent mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Baked Fresh Daily · Handcrafted in Mumbai</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
            Artisanal Bakes Crafted With Heart & Pure Passion.
          </h1>

          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-light">
            Indulge in slow-fermented organic sourdoughs, flaky Parisian viennoiserie, and bespoke custom celebration cakes crafted by master pâtissiers.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setActiveTab('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-lg shadow-primary/40 flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Bakery Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveTab('custom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span>🎂 Build Custom Cake</span>
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/10 max-w-lg">
            <div>
              <p className="font-serif text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-white/60">Natural Leaven</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-white">4.9 ★</p>
              <p className="text-xs text-white/60">Over 2,400+ Reviews</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-white">6 AM</p>
              <p className="text-xs text-white/60">Fresh Hearth Oven</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Browse By Craft</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">Our Signature Collections</h2>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap shadow-xs ${
              selectedCategory === null
                ? 'bg-primary text-white shadow-primary/20'
                : 'bg-white text-ink border border-surface-border hover:border-primary/40'
            }`}
          >
            ✨ All Creations
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.category_id}
              onClick={() => handleCategorySelect(cat._id || cat.category_id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 shadow-xs ${
                selectedCategory === (cat._id || cat.category_id)
                  ? 'bg-primary text-white shadow-primary/20'
                  : 'bg-white text-ink border border-surface-border hover:border-primary/40'
              }`}
            >
              <span>{cat.iconUrl || '🧁'}</span>
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-75">({cat.product_count || 0})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-surface-card animate-pulse" />
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12 text-ink-muted">
              No products found in this category.
            </div>
          ) : (
            products.map((p) => (
              <ProductCard
                key={p.product_id || p._id}
                product={p}
                onSelect={onSelectProduct}
              />
            ))
          )}
        </div>
      </section>

      {/* Promo Offer Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-primary p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs">
            Special Launch Privilege
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold">
            Enjoy 20% OFF On Your Entire Order
          </h3>
          <p className="text-white/90 text-sm max-w-lg">
            Use exclusive coupon code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded-md">BAKE20</span> at checkout on all orders above ₹500.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-shrink-0">
          <button
            onClick={() => setActiveTab('menu')}
            className="px-6 py-3.5 rounded-2xl bg-white text-primary font-bold text-sm shadow-lg hover:bg-surface-warm transition-all active:scale-95"
          >
            Claim 20% Discount
          </button>
        </div>
      </section>

      {/* BakeMaster Arcade Mini-Game Teaser */}
      <section className="rounded-3xl border border-surface-border bg-gradient-to-br from-[#2C1810] to-[#1A0D07] text-white p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold">
            <Gamepad2 className="w-4 h-4" />
            <span>Purble Palace-Inspired Mini-Game</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Play the BakeMaster Arcade Challenge!
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Channel your inner master pastry chef! Assemble cakes matching customer orders on the conveyor line before the timer runs out. Earn 3-star ratings and win high-score glory!
          </p>
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('game')}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-primary text-white font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2 hover:opacity-95 transition-all active:scale-95"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Launch BakeMaster Game</span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-96 aspect-4/3 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-6 text-center relative group">
          <img
            src="/images/custom-cake-preview.png"
            alt="BakeMaster mini game"
            className="w-48 h-48 object-contain animate-bounce drop-shadow-[0_20px_20px_rgba(244,162,97,0.3)] duration-1000"
            onError={(e) => {
              e.target.src = '/images/chocolate-truffle-cake.png';
            }}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Customer Love</span>
          <h2 className="font-serif text-3xl font-bold text-ink mt-1">What Mumbai Says About BakeEase</h2>
          <p className="text-sm text-ink-muted mt-2">
            Thousands of morning smiles, birthdays celebrated, and sweet moments delivered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-400 mb-3">
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`w-4 h-4 ${starIndex < r.rating ? 'fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-ink font-medium leading-relaxed italic mb-4">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-surface-border/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  {r.reviewer_name?.slice(0, 2).toUpperCase() || 'CU'}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-ink">{r.reviewer_name}</h5>
                  <p className="text-[11px] text-ink-light">Verified Customer · Mumbai</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
