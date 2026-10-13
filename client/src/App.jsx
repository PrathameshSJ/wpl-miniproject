import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ProductDetailModal from './components/ProductDetailModal';

// Views
import HomeView from './views/HomeView';
import MenuView from './views/MenuView';
import CustomCakeView from './views/CustomCakeView';
import GameView from './views/GameView';
import CheckoutView from './views/CheckoutView';
import OrdersView from './views/OrdersView';
import ContactView from './views/ContactView';
import AdminView from './views/AdminView';

function ToastContainer() {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
      <span>{toast.message}</span>
    </div>
  );
}

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // If user is on admin view and logs out or loses admin role, immediately reset to home
  useEffect(() => {
    if (activeTab === 'admin' && !isAdmin) {
      setActiveTab('home');
    }
  }, [activeTab, isAdmin]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-warm font-sans text-ink selection:bg-primary selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activeTab === 'menu' && (
          <MenuView
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activeTab === 'custom' && (
          <CustomCakeView setActiveTab={setActiveTab} />
        )}

        {activeTab === 'game' && <GameView />}

        {activeTab === 'checkout' && (
          <CheckoutView
            setActiveTab={setActiveTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            setActiveTab={setActiveTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'contact' && <ContactView />}

        {activeTab === 'admin' && <AdminView setActiveTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setActiveTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Global Toast */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
