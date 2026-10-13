import React, { useState } from 'react';
import { ShoppingBag, Tag, Check, Truck, Store, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch, getImageUrl } from '../api';
import confetti from 'canvas-confetti';

export default function CheckoutView({ setActiveTab, onOpenAuth }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  // Checkout form state
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('Apt 4B, Emerald Residency, Bandra West, Mumbai 400050');
  const [scheduledAt, setScheduledAt] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Order submission
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError('');

    try {
      const data = await apiFetch('/coupons', {
        method: 'POST',
        body: {
          code: couponCode,
          cartTotal,
        },
      });
      setAppliedCoupon(data);
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const finalDiscount = appliedCoupon ? appliedCoupon.discount_amt || appliedCoupon.discountAmt || 0 : 0;
  const deliveryFee = deliveryType === 'delivery' && (cartTotal - finalDiscount) < 500 ? 50 : 0;
  const grandTotal = Math.max(0, cartTotal - finalDiscount + deliveryFee);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (cart.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const itemsPayload = cart.map((item) => ({
        product_id: item.product_id || item._id,
        quantity: item.quantity,
        customisation: item.customisation || null,
      }));

      const res = await apiFetch('/orders', {
        method: 'POST',
        body: {
          items: itemsPayload,
          delivery_type: deliveryType,
          delivery_address: deliveryType === 'delivery' ? deliveryAddress : 'Bakery Pickup',
          scheduled_at: scheduledAt || null,
          payment_method: paymentMethod,
        },
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });

      setOrderSuccess(res);
      clearCart();
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
          🎉
        </div>
        <h2 className="font-serif text-3xl font-bold text-ink">Order Successfully Placed!</h2>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          Thank you for ordering with BakeEase! Our chefs are preparing your artisanal bakes fresh in our hearth oven.
        </p>

        <div className="p-6 rounded-3xl bg-white border border-surface-border text-left space-y-3 shadow-xs">
          <div className="flex justify-between text-xs text-ink-muted">
            <span>Order Reference</span>
            <span className="font-mono font-bold text-ink">{orderSuccess.order_id || orderSuccess.order?._id}</span>
          </div>
          <div className="flex justify-between text-xs text-ink-muted">
            <span>Fulfillment Type</span>
            <span className="font-semibold text-ink capitalize">{deliveryType}</span>
          </div>
          <div className="flex justify-between text-xs text-ink-muted">
            <span>Payment Method</span>
            <span className="font-semibold text-ink uppercase">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-surface-border">
            <span>Amount Paid</span>
            <span className="text-primary font-serif">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('orders')}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-md transition-all"
          >
            Track in My Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className="px-6 py-3 rounded-xl bg-surface-card border border-surface-border text-ink font-semibold text-sm hover:bg-surface-warm transition-all"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <span className="text-5xl block">🧁</span>
        <h2 className="font-serif text-2xl font-bold text-ink">Your basket is empty</h2>
        <p className="text-xs text-ink-muted">
          Add some delicious pastries or custom cakes to your basket before checking out.
        </p>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all"
        >
          View Bakery Menu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="text-center max-w-xl mx-auto pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Final Step</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
          Review & Checkout
        </h1>
        <p className="text-xs text-ink-muted mt-1.5">
          Choose delivery or click-and-collect pickup from our Bandra bakery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Details & Payment */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Fulfillment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-ink">1. Fulfillment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  deliveryType === 'delivery'
                    ? 'border-primary bg-primary-light/60 shadow-xs ring-1 ring-primary'
                    : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">Doorstep Delivery</p>
                  <p className="text-xs text-ink-muted">To your home or office</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  deliveryType === 'pickup'
                    ? 'border-primary bg-primary-light/60 shadow-xs ring-1 ring-primary'
                    : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">Click & Collect</p>
                  <p className="text-xs text-ink-muted">Bandra West Flagship</p>
                </div>
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-ink-muted">Delivery Address</label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Apartment, building, street, area, pincode..."
                  className="w-full p-3 rounded-2xl border border-surface-border text-sm focus:outline-hidden focus:border-primary bg-surface-card"
                />
              </div>
            )}

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-ink-muted">
                Desired Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full p-3 rounded-2xl border border-surface-border text-sm focus:outline-hidden focus:border-primary bg-surface-card"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-ink">2. Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary-light/60 shadow-xs ring-1 ring-primary'
                    : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="hidden"
                />
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-bold text-sm text-ink">UPI / Razorpay</p>
                  <p className="text-xs text-ink-muted">GPay, PhonePe, Paytm</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary-light/60 shadow-xs ring-1 ring-primary'
                    : 'border-surface-border bg-surface-card hover:bg-surface-warm'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="hidden"
                />
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-bold text-sm text-ink">Cash on Delivery</p>
                  <p className="text-xs text-ink-muted">Pay at pickup / delivery</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Placing Order...' : `Confirm & Place Order (₹${grandTotal})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-ink border-b border-surface-border pb-3">
              Order Summary ({cart.length})
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-surface-warm border border-surface-border flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/images/chocolate-truffle-cake.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{item.name}</p>
                    <p className="text-ink-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-ink">
                    ₹{(item.basePrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-surface-border space-y-2">
              <label className="block text-xs font-medium text-ink-muted">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Try BAKE20"
                  className="flex-1 px-3 py-2 rounded-xl border border-surface-border text-xs focus:outline-hidden focus:border-primary uppercase bg-surface-card"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  className="px-4 py-2 rounded-xl bg-ink text-white text-xs font-semibold hover:bg-black transition-all"
                >
                  {validatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Coupon {appliedCoupon.code} applied! Saved ₹{finalDiscount}
                </p>
              )}
              {couponError && <p className="text-xs text-red-600">{couponError}</p>}
            </form>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-surface-border space-y-2 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>Items Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {finalDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Promo Discount ({appliedCoupon?.discount_pct}%)</span>
                  <span>-₹{finalDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-surface-border">
                <span>Grand Total</span>
                <span className="text-primary font-serif text-lg">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
