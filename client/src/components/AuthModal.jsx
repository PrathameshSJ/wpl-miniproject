import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      } else {
        await login(formData.email, formData.password);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@bakeease.in',
        password: 'admin123',
        fullName: 'Amit Kumar',
        phone: '9876543210',
      });
      setIsRegister(false);
    } else {
      setFormData({
        email: 'priya@example.com',
        password: 'customer123',
        fullName: 'Priya Sharma',
        phone: '9876543211',
      });
      setIsRegister(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-surface-border overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-surface-warm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-surface-warm/60 border-b border-surface-border text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="text-3xl">🧁</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-ink">
            {isRegister ? 'Join the BakeEase Family' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-ink-muted mt-1">
            {isRegister
              ? 'Create an account for quick orders & artisan rewards'
              : 'Sign in to access your orders and bakery privileges'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-surface-card p-1 rounded-xl mt-5 border border-surface-border">
            <button
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isRegister
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Quick Demo Credentials */}
        <div className="px-8 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-2 text-center">
            ⚡ Quick Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('customer')}
              className="px-3 py-2 rounded-xl bg-primary-light hover:bg-primary-container border border-primary/20 text-primary-dark text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-surface-card"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-surface-card"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-surface-card"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-surface-card"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-sm shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Create My Account' : 'Sign In to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
