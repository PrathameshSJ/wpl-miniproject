import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('bakeease_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bakeease_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, quantity = 1, customisation = null) => {
    setCart((prev) => {
      // Find if an identical product + customisation already exists
      const existingIndex = prev.findIndex((item) => {
        const sameId = (item.product_id || item._id) === (product.product_id || product._id);
        const sameCustom = JSON.stringify(item.customisation) === JSON.stringify(customisation);
        return sameId && sameCustom;
      });

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      const newItem = {
        _id: product._id || product.product_id,
        product_id: product.product_id || product._id,
        name: product.name,
        basePrice: Number(product.basePrice || product.base_price),
        imageUrl: product.imageUrl || product.image_url,
        quantity,
        customisation,
      };

      return [...prev, newItem];
    });

    showToast(`Added ${quantity}x ${product.name} to cart!`);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (index, qty) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = qty;
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toast,
        showToast,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
