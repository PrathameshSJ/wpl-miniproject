import React from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const rating = parseFloat(product.avg_rating || product.avgRating || 5).toFixed(1);
  const price = parseFloat(product.base_price || product.basePrice || 0).toLocaleString('en-IN');
  const imgUrl = getImageUrl(product.image_url || product.imageUrl);

  return (
    <div
      onClick={() => onSelect?.(product)}
      className="group bg-white rounded-3xl border border-surface-border p-3.5 hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-surface-warm mb-3.5">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/images/chocolate-truffle-cake.png';
            }}
          />

          {/* Category Pill */}
          {product.category_name && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-primary shadow-xs">
              {product.category_icon || '🧁'} {product.category_name}
            </span>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-ink/75 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{rating}</span>
          </div>

          {/* Low Stock Badge if applicable */}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold tracking-wider uppercase">
              Only {product.stock_quantity} left
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-1">
          <h3 className="font-serif font-bold text-base text-ink group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-3">
            {product.description || 'Freshly baked using wholesome artisan ingredients.'}
          </p>
        </div>
      </div>

      {/* Bottom Price & Add to Cart */}
      <div className="px-1 pt-2 border-t border-surface-border/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-ink-light uppercase tracking-wider block -mb-0.5">Price</span>
          <span className="font-serif font-bold text-lg text-ink">₹{price}</span>
        </div>

        <button
          onClick={handleAdd}
          className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20 active:scale-95 transition-all flex items-center justify-center"
          title="Add to Basket"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
