import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, Flame, AlertCircle } from 'lucide-react';
import { apiFetch, getImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

export default function OrdersView({ setActiveTab, onOpenAuth }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const data = await apiFetch('/orders?my=1');
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <span className="text-4xl block">🔒</span>
        <h2 className="font-serif text-2xl font-bold text-ink">Sign in to view your orders</h2>
        <p className="text-xs text-ink-muted">
          Access your past orders, real-time baking status, and delivery tracking.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'baking': return 2;
      case 'out_for_delivery': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Order History</span>
        <h1 className="font-serif text-3xl font-bold text-ink mt-1">My Orders & Live Status</h1>
        <p className="text-xs text-ink-muted mt-1">
          Track your fresh bakes from the oven to your doorstep.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-surface-card animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-surface-border space-y-3">
          <span className="text-4xl block">📦</span>
          <h3 className="font-serif font-bold text-xl text-ink">No orders yet</h3>
          <p className="text-xs text-ink-muted">
            You haven't placed any orders with BakeEase yet. Time for a treat!
          </p>
          <button
            onClick={() => setActiveTab('menu')}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all"
          >
            Explore Bakery Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const step = getStatusStep(order.status);
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order._id || order.order_id}
                className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-6 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border/60 gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-primary">
                      #{String(order._id || order.order_id).slice(-8).toUpperCase()}
                    </span>
                    <p className="text-xs text-ink-muted">
                      Placed on {new Date(order.createdAt || order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'baking'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'out_for_delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-serif font-bold text-lg text-ink">
                      ₹{parseFloat(order.totalAmount || order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                {!isCancelled && (
                  <div className="py-2">
                    <div className="grid grid-cols-4 relative text-center text-xs">
                      {/* Line connecting */}
                      <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-surface-border -z-0">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{
                            width: `${Math.max(0, (step - 1) / 3) * 100}%`,
                          }}
                        />
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 1 ? 'bg-primary text-white shadow-xs' : 'bg-surface-border text-ink-muted'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="font-semibold mt-2 text-ink">Received</span>
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 2 ? 'bg-primary text-white shadow-xs' : 'bg-surface-border text-ink-muted'
                          }`}
                        >
                          <Flame className="w-4 h-4" />
                        </div>
                        <span className="font-semibold mt-2 text-ink">Baking</span>
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 3 ? 'bg-primary text-white shadow-xs' : 'bg-surface-border text-ink-muted'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="font-semibold mt-2 text-ink">On The Way</span>
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 4 ? 'bg-green-600 text-white shadow-xs' : 'bg-surface-border text-ink-muted'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="font-semibold mt-2 text-ink">Delivered</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="pt-2 border-t border-surface-border/40 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Ordered Treats ({order.items?.length || 0})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-surface-card border border-surface-border/60 flex items-center justify-between"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-ink">{item.quantity}x</span>{' '}
                          <span className="text-ink">{item.name || item.product?.name}</span>
                          {item.customisation && (
                            <p className="text-[10px] text-ink-muted truncate">
                              {item.customisation.flavour} · {item.customisation.size}
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-ink-muted">
                          ₹{(item.unitPrice || item.unit_price || 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="text-[11px] text-ink-muted pt-2 flex flex-wrap justify-between gap-2 border-t border-surface-border/40">
                  <span>
                    Fulfillment: <strong className="text-ink capitalize">{order.deliveryType || order.delivery_type}</strong>
                    {order.deliveryAddress ? ` (${order.deliveryAddress})` : ''}
                  </span>
                  <span>
                    Payment: <strong className="text-ink uppercase">{order.payment?.method || 'COD'}</strong> (
                    {order.payment?.status || 'pending'})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
