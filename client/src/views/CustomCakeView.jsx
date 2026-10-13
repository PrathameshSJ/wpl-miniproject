import React, { useState } from 'react';
import { Cake, Sparkles, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

export default function CustomCakeView({ setActiveTab }) {
  const { addToCart } = useCart();

  // Wizard state
  const [size, setSize] = useState('1 Kg');
  const [flavour, setFlavour] = useState('Belgian Chocolate');
  const [frosting, setFrosting] = useState('Whipped Swiss Buttercream');
  const [selectedToppings, setSelectedToppings] = useState(['Fresh Seasonal Berries']);
  const [cakeMessage, setCakeMessage] = useState('Happy Birthday!');

  const sizes = [
    { id: '0.5 Kg', label: '0.5 Kg (Bento)', serves: '2-4 Servings', price: 599 },
    { id: '1 Kg', label: '1 Kg (Signature)', serves: '6-8 Servings', price: 999 },
    { id: '1.5 Kg', label: '1.5 Kg (Family)', serves: '10-12 Servings', price: 1399 },
    { id: '2 Kg', label: '2 Kg (Party)', serves: '15-18 Servings', price: 1799 },
    { id: '2-Tier', label: '2-Tier Grand', serves: '20-25 Servings', price: 2499 },
  ];

  const flavours = [
    { id: 'Belgian Chocolate', label: 'Belgian Chocolate', img: 'base-chocolate.png', priceAdd: 0 },
    { id: 'Madagascar Vanilla', label: 'Madagascar Vanilla', img: 'base-vanilla.png', priceAdd: 0 },
    { id: 'Crimson Red Velvet', label: 'Crimson Red Velvet', img: 'base-redvelvet.png', priceAdd: 100 },
    { id: 'Spiced Carrot & Walnut', label: 'Carrot & Walnut', img: 'base-carrot.png', priceAdd: 150 },
    { id: 'Confetti Rainbow', label: 'Confetti Rainbow', img: 'base-confetti.png', priceAdd: 100 },
    { id: 'Japanese Matcha', label: 'Japanese Matcha', img: 'base-matcha.png', priceAdd: 200 },
    { id: 'Marble Swirl', label: 'Marble Swirl', img: 'base-marble.png', priceAdd: 50 },
  ];

  const frostings = [
    { id: 'Whipped Swiss Buttercream', label: 'Whipped Swiss Buttercream', desc: 'Silky, light, and perfectly balanced', priceAdd: 0 },
    { id: 'Dark Chocolate Ganache', label: '70% Dark Chocolate Ganache', desc: 'Decadent Belgian cocoa glaze', priceAdd: 120 },
    { id: 'Tangy Cream Cheese', label: 'Tangy Cream Cheese', desc: 'Velvety pairing with berries & velvet', priceAdd: 100 },
    { id: 'Salted Caramel Drizzle', label: 'Salted Caramel Buttercream', desc: 'Infused with French fleur de sel', priceAdd: 80 },
  ];

  const toppings = [
    { id: 'Fresh Seasonal Berries', label: 'Fresh Seasonal Berries 🍓', priceAdd: 150 },
    { id: 'French Macarons Accents', label: 'French Macarons (x4) 🍬', priceAdd: 200 },
    { id: '24K Edible Gold Leaf', label: '24K Edible Gold Leaf ✨', priceAdd: 250 },
    { id: 'Handmade Fondant Flowers', label: 'Fondant Flowers 🌸', priceAdd: 120 },
    { id: 'Artisan Confetti Sprinkles', label: 'Artisan Sprinkles 🎊', priceAdd: 50 },
  ];

  const toggleTopping = (toppingId) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((t) => t !== toppingId)
        : [...prev, toppingId]
    );
  };

  // Price calculation
  const sizeObj = sizes.find((s) => s.id === size) || sizes[1];
  const flavourObj = flavours.find((f) => f.id === flavour) || flavours[0];
  const frostingObj = frostings.find((fr) => fr.id === frosting) || frostings[0];
  const toppingsPrice = selectedToppings.reduce((sum, topId) => {
    const t = toppings.find((item) => item.id === topId);
    return sum + (t ? t.priceAdd : 0);
  }, 0);

  const totalPrice = sizeObj.price + flavourObj.priceAdd + frostingObj.priceAdd + toppingsPrice;

  const handleAddToCart = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    const customCakeProduct = {
      _id: 'custom-cake-builder',
      name: `Custom Cake: ${flavour} (${size})`,
      basePrice: totalPrice,
      imageUrl: flavourObj.img,
      customisation: {
        size,
        flavour,
        frosting,
        toppings: selectedToppings,
        message: cakeMessage,
      },
    };

    addToCart(customCakeProduct, 1, customCakeProduct.customisation);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Artisan Cake Studio</span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mt-1">
          Build Your Dream Cake
        </h1>
        <p className="text-sm text-ink-muted mt-2">
          Customize every layer, flavor, frosting, and personal message. Baked fresh for your special moments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Wizard Steps */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Size */}
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-serif font-bold text-lg text-ink">Choose Cake Size</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    size === s.id
                      ? 'border-primary bg-primary-light/60 shadow-xs'
                      : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                  }`}
                >
                  <p className="font-bold text-sm text-ink">{s.label}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{s.serves}</p>
                  <p className="text-xs font-bold text-primary mt-2">₹{s.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Flavour */}
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-serif font-bold text-lg text-ink">Select Sponge Flavour</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {flavours.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFlavour(f.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    flavour === f.id
                      ? 'border-primary bg-primary-light/60 shadow-xs ring-1 ring-primary'
                      : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                  }`}
                >
                  <img
                    src={`/images/${f.img}`}
                    alt={f.label}
                    className="w-10 h-10 rounded-xl object-cover bg-white flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/images/chocolate-truffle-cake.png';
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-ink truncate">{f.label}</p>
                    {f.priceAdd > 0 ? (
                      <p className="text-[11px] text-primary">+₹{f.priceAdd}</p>
                    ) : (
                      <p className="text-[11px] text-green-600">Included</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Frosting */}
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-serif font-bold text-lg text-ink">Select Artisan Frosting</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {frostings.map((fr) => (
                <button
                  key={fr.id}
                  onClick={() => setFrosting(fr.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    frosting === fr.id
                      ? 'border-primary bg-primary-light/60 shadow-xs'
                      : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-xs text-ink">{fr.label}</p>
                    {fr.priceAdd > 0 && (
                      <span className="text-xs text-primary font-bold">+₹{fr.priceAdd}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-muted mt-1">{fr.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Toppings & Accents */}
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="font-serif font-bold text-lg text-ink">Choose Toppings & Accents</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {toppings.map((top) => {
                const isSelected = selectedToppings.includes(top.id);
                return (
                  <button
                    key={top.id}
                    onClick={() => toggleTopping(top.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-primary-light/60 shadow-xs'
                        : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          isSelected ? 'bg-primary text-white' : 'border border-surface-border bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-semibold text-ink">{top.label}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">+₹{top.priceAdd}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Inscription Message */}
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h3 className="font-serif font-bold text-lg text-ink">Personal Inscription on Cake</h3>
            </div>
            <div>
              <input
                type="text"
                maxLength={45}
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                placeholder="e.g. Happy 21st Birthday Aryan!"
                className="w-full px-4 py-3 rounded-2xl border border-surface-border text-sm focus:outline-hidden focus:border-primary bg-surface-card"
              />
              <p className="text-[11px] text-ink-light mt-1.5 flex justify-between">
                <span>Free hand-piped artisanal chocolate inscription</span>
                <span>{cakeMessage.length}/45 chars</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Columns: Sticky Live Visual Preview & Summary */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-serif font-bold text-xl text-ink">Live Cake Preview</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent font-bold uppercase tracking-wider">
                Bespoke Order
              </span>
            </div>

            {/* Visual Preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-surface-warm to-surface-card border border-surface-border flex items-center justify-center p-6">
              <img
                src={`/images/${flavourObj.img}`}
                alt={flavour}
                className="w-52 h-52 object-contain drop-shadow-2xl transition-all duration-500 animate-pulse-subtle"
                onError={(e) => {
                  e.target.src = '/images/custom-cake-preview.png';
                }}
              />

              {/* Message Plaque Overlay on cake */}
              {cakeMessage && (
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm border border-amber-300 py-2 px-3 rounded-xl shadow-lg text-center">
                  <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-widest">
                    Piped Inscription
                  </p>
                  <p className="font-serif font-bold text-sm text-primary italic truncate">
                    "{cakeMessage}"
                  </p>
                </div>
              )}
            </div>

            {/* Cake Configuration Specs */}
            <div className="space-y-2 text-xs bg-surface-warm/50 p-4 rounded-2xl border border-surface-border/60">
              <div className="flex justify-between">
                <span className="text-ink-muted">Size:</span>
                <span className="font-bold text-ink">{size} ({sizeObj.serves})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Sponge Flavour:</span>
                <span className="font-bold text-ink">{flavour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Frosting:</span>
                <span className="font-bold text-ink">{frosting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Accents:</span>
                <span className="font-bold text-ink">
                  {selectedToppings.length > 0 ? selectedToppings.length + ' selected' : 'None'}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-2 border-t border-surface-border space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-ink-muted">Total Custom Cake Price</span>
                <span className="font-serif text-3xl font-bold text-primary">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Add to Basket Action */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add Custom Cake to Basket (₹{totalPrice})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
