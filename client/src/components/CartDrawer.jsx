import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api';

export default function CartDrawer({ onProceedToCheckout }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, isDrawerOpen, setIsDrawerOpen } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-ink/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-surface-border animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-surface-border flex items-center justify-between bg-surface-warm/40">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-bold text-lg text-ink">Your Bakery Basket</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-semibold">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-card transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-ink-muted">
                <div className="w-20 h-20 rounded-full bg-surface-warm flex items-center justify-center mb-4 text-4xl shadow-inner">
                  🥐
                </div>
                <h4 className="font-serif font-bold text-xl text-ink mb-1">Your basket is empty</h4>
                <p className="text-sm max-w-xs mb-6">
                  Browse our artisanal breads, cakes and French pastries to fill your basket!
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product_id}-${index}`}
                  className="flex gap-4 p-3.5 rounded-2xl bg-surface-card border border-surface-border/80 hover:border-primary/30 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white flex-shrink-0 border border-surface-border"
                    onError={(e) => {
                      e.target.src = '/images/chocolate-truffle-cake.png';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm text-ink truncate pr-2">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-ink-light hover:text-red-500 p-1 -mt-1 -mr-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Custom cake attributes */}
                      {item.customisation && (
                        <div className="mt-1 text-[11px] text-ink-muted bg-white/80 p-1.5 rounded-lg border border-surface-border/60">
                          {item.customisation.size && <span>Size: {item.customisation.size} · </span>}
                          {item.customisation.flavour && <span>{item.customisation.flavour} · </span>}
                          {item.customisation.frosting && <span>{item.customisation.frosting}</span>}
                          {item.customisation.message && (
                            <p className="italic text-primary truncate mt-0.5">
                              "{item.customisation.message}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-border/40">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-surface-border rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-2 py-1 text-ink-muted hover:text-ink hover:bg-surface-warm transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-ink">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-2 py-1 text-ink-muted hover:text-ink hover:bg-surface-warm transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="font-bold text-sm text-primary">
                        ₹{(item.basePrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-surface-border bg-surface-warm/30 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Estimated Delivery</span>
                  <span className="text-green-600 font-medium">Free over ₹500</span>
                </div>
                <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-surface-border">
                  <span>Total Amount</span>
                  <span className="text-primary font-serif text-lg">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
