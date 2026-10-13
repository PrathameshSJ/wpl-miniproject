import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu, X, Sparkles, Gamepad2, Cake, ShieldCheck, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu & Catalogue' },
    { id: 'custom', label: 'Custom Cake Studio', badge: 'Popular', icon: Cake },
    { id: 'game', label: 'BakeMaster Game', badge: 'Mini-Game', icon: Gamepad2 },
    { id: 'contact', label: 'Contact & Feedback' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-nav border-b border-surface-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">🧁</span>
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-1">
                Bake<span className="text-primary">Ease</span>
              </span>
              <p className="text-[10px] uppercase tracking-widest text-ink-muted font-medium -mt-1">
                Artisan Bakery · Mumbai
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-primary bg-primary-light/80 font-semibold shadow-xs'
                      : 'text-ink-muted hover:text-primary hover:bg-surface-card'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-primary" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-semibold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}

            {/* My Orders link if user is logged in */}
            {user && (
              <button
                onClick={() => handleNavClick('orders')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'text-primary bg-primary-light/80 font-semibold'
                    : 'text-ink-muted hover:text-primary hover:bg-surface-card'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </button>
            )}

            {/* Admin Portal Tab */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 flex items-center gap-1.5 border ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Suite</span>
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-xl text-ink hover:text-primary hover:bg-surface-card transition-all active:scale-95"
              title="View Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Button or User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-card border border-surface-border hover:border-primary/40 transition-all text-sm font-medium text-ink"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">
                    {user.fullName || user.email}
                  </span>
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-surface-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-surface-border/60">
                      <p className="text-xs text-ink-muted">Signed in as</p>
                      <p className="text-sm font-semibold text-ink truncate">{user.fullName}</p>
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 mt-1 rounded-full bg-primary-light text-primary">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('orders');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface-warm flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-ink-muted" />
                      Order History
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-surface-border/60 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        if (activeTab === 'admin') {
                          handleNavClick('home');
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-sm shadow-primary/20 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-ink hover:bg-surface-card"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-surface-border px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'text-ink hover:bg-surface-warm'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {user && (
            <button
              onClick={() => handleNavClick('orders')}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-ink hover:bg-surface-warm flex items-center gap-2"
            >
              <Package className="w-5 h-5 text-primary" />
              <span>My Orders</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Admin Management Suite</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                if (activeTab === 'admin') {
                  handleNavClick('home');
                }
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
