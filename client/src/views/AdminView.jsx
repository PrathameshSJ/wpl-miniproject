import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LayoutDashboard, Package, ShoppingBag, Database,
  Users, MessageSquare, BarChart3, Settings, Plus, Check, Trash2, Edit, AlertTriangle
} from 'lucide-react';
import { apiFetch, getImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminView({ setActiveTab }) {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🔒
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">Admin Access Restricted</h2>
        <p className="text-xs text-ink-muted leading-relaxed">
          You must be signed in with an administrator account to view the administration suite.
        </p>
        <button
          onClick={() => setActiveTab?.('home')}
          className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: '',
    base_price: '',
    description: '',
    stock_quantity: 20,
    imageUrl: 'chocolate-truffle-cake.png',
  });

  // Load active tab data
  useEffect(() => {
    loadTabData(activeAdminTab);
  }, [activeAdminTab]);

  const loadTabData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const data = await apiFetch('/dashboard');
        setDashboardData(data);
      } else if (tab === 'products') {
        const [prodsData, catsData] = await Promise.all([
          apiFetch('/products?all=1'),
          apiFetch('/categories'),
        ]);
        setProducts(prodsData.products || []);
        setCategories(catsData || []);
        if (catsData?.length > 0 && !newProduct.category_id) {
          setNewProduct((prev) => ({ ...prev, category_id: catsData[0]._id || catsData[0].category_id }));
        }
      } else if (tab === 'orders') {
        const data = await apiFetch('/orders');
        setOrders(data || []);
      } else if (tab === 'inventory') {
        const data = await apiFetch('/inventory');
        setInventory(data || []);
      } else if (tab === 'customers') {
        const data = await apiFetch('/customers');
        setCustomers(data || []);
      } else if (tab === 'reviews') {
        const data = await apiFetch('/reviews');
        setReviews(data || []);
      } else if (tab === 'reports') {
        const data = await apiFetch('/reports');
        setReports(data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiFetch(`/orders/${orderId}`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      loadTabData(activeAdminTab);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/products', {
        method: 'POST',
        body: newProduct,
      });
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        category_id: categories[0]?._id || '',
        base_price: '',
        description: '',
        stock_quantity: 20,
        imageUrl: 'chocolate-truffle-cake.png',
      });
      loadTabData('products');
    } catch (err) {
      alert(err.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      loadTabData('products');
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleUpdateInventory = async (id, currentQty) => {
    const input = prompt('Enter new stock quantity in Kg/Units:', currentQty);
    if (input === null || isNaN(Number(input))) return;

    try {
      await apiFetch(`/inventory/${id}`, {
        method: 'PUT',
        body: { quantityKg: Number(input) },
      });
      loadTabData('inventory');
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const handleModerateReview = async (id, isApproved, shouldDelete = false) => {
    try {
      await apiFetch(`/reviews/${id}`, {
        method: 'PATCH',
        body: shouldDelete ? { delete: true } : { isApproved },
      });
      loadTabData('reviews');
    } catch (err) {
      alert(err.message || 'Failed to update review');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders Fulfillment', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory Pantry', icon: Database },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
    { id: 'reports', label: 'Business Reports', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Artisan Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">BakeEase Administration Suite</h1>
          <p className="text-white/70 text-xs mt-1">
            Manage bakery products, fulfill oven orders, monitor inventory, and review real-time sales analytics.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-amber-200">
          🟢 Backend API Connected (MERN)
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-amber-700 text-white shadow-md shadow-amber-700/20'
                  : 'bg-white text-ink border border-surface-border hover:bg-surface-warm'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">
        {/* 1. DASHBOARD OVERVIEW */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs">
                <span className="text-xs text-ink-muted uppercase tracking-wider">Today's Revenue</span>
                <p className="font-serif text-3xl font-bold text-ink mt-2">
                  ₹{parseFloat(dashboardData?.today_revenue || dashboardData?.todayRevenue || 0).toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-green-600 font-medium mt-1 block">Live Stone-Hearth Sales</span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs">
                <span className="text-xs text-ink-muted uppercase tracking-wider">Today's Orders</span>
                <p className="font-serif text-3xl font-bold text-ink mt-2">
                  {dashboardData?.today_orders || dashboardData?.todayOrders || 0}
                </p>
                <span className="text-[11px] text-ink-muted mt-1 block">Placed within 24h</span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs">
                <span className="text-xs text-ink-muted uppercase tracking-wider">Pending Orders</span>
                <p className="font-serif text-3xl font-bold text-orange-600 mt-2">
                  {dashboardData?.pending_orders || dashboardData?.pendingOrders || 0}
                </p>
                <span className="text-[11px] text-orange-600 font-medium mt-1 block">Requires baking action</span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs">
                <span className="text-xs text-ink-muted uppercase tracking-wider">Low Stock Warnings</span>
                <p className="font-serif text-3xl font-bold text-red-600 mt-2">
                  {dashboardData?.low_stock_count || dashboardData?.lowStockCount || 0}
                </p>
                <span className="text-[11px] text-red-600 font-medium mt-1 block">Ingredients below threshold</span>
              </div>
            </div>

            {/* 7-Day Revenue Trend & Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 7-Day Trend */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-ink">7-Day Revenue Trend</h3>
                <div className="space-y-3 pt-2">
                  {(dashboardData?.revenue_7days || dashboardData?.revenue7days || []).map((day, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-ink-muted">{day.date}</span>
                        <span className="font-bold text-ink">₹{day.revenue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-surface-warm h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${Math.min(100, (day.revenue / 5000) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Sellers */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-ink">Top 5 Best Sellers</h3>
                <div className="space-y-3">
                  {(dashboardData?.best_sellers || dashboardData?.bestSellers || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-surface-card border border-surface-border/60 flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold text-ink truncate">{item.name}</p>
                        <p className="text-ink-muted">{item.units_sold} units baked & sold</p>
                      </div>
                      <span className="font-bold text-primary font-serif">
                        ₹{item.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-ink">Recent 10 Customer Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-border text-ink-muted">
                      <th className="pb-3 font-semibold">Order Ref</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Items</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/60">
                    {(dashboardData?.recent_orders || dashboardData?.recentOrders || []).map((order) => (
                      <tr key={order.order_id} className="hover:bg-surface-warm/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-primary">
                          #{String(order.order_id).slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 font-medium text-ink">{order.customer_name}</td>
                        <td className="py-3 text-ink-muted max-w-xs truncate">{order.items_summary}</td>
                        <td className="py-3 font-bold text-ink font-serif">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'baking'
                                ? 'bg-amber-100 text-amber-800'
                                : order.status === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.order_id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="baking">Baking</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS MANAGEMENT */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-2xl text-ink">Catalogue Inventory ({products.length})</h3>
                <p className="text-xs text-ink-muted">Add, modify pricing, stock levels, or retire bakery items.</p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-surface-border shadow-2xl space-y-4">
                  <h3 className="font-serif font-bold text-xl text-ink">Add New Bakery Product</h3>
                  <form onSubmit={handleCreateProduct} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-ink-muted mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. Pistachio Raspberry Tart"
                        className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">Category</label>
                        <select
                          value={newProduct.category_id}
                          onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                        >
                          {categories.map((c) => (
                            <option key={c._id || c.category_id} value={c._id || c.category_id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={newProduct.base_price}
                          onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
                          placeholder="450"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-muted mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Wholesome ingredients, flavor notes..."
                        className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">Initial Stock Units</label>
                        <input
                          type="number"
                          value={newProduct.stock_quantity}
                          onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">Image Asset Name</label>
                        <input
                          type="text"
                          value={newProduct.imageUrl}
                          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                          placeholder="Croissants.png"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(false)}
                        className="flex-1 py-2.5 rounded-xl border border-surface-border text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm"
                      >
                        Create Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-ink-muted">
                    <th className="pb-3 font-semibold">Item</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Stock</th>
                    <th className="pb-3 font-semibold">Rating</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {products.map((p) => (
                    <tr key={p._id || p.product_id} className="hover:bg-surface-warm/40 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <img
                          src={getImageUrl(p.image_url || p.imageUrl)}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-surface-border flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/images/chocolate-truffle-cake.png';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-ink truncate">{p.name}</p>
                          <p className="text-[11px] text-ink-muted truncate max-w-xs">{p.description}</p>
                        </div>
                      </td>
                      <td className="py-3 font-medium text-ink-muted">{p.category_name || 'Artisan'}</td>
                      <td className="py-3 font-bold text-ink font-serif">₹{p.base_price || p.basePrice}</td>
                      <td className="py-3 font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] ${
                            (p.stock_quantity || p.stockQuantity) <= 5
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {p.stock_quantity || p.stockQuantity} units
                        </span>
                      </td>
                      <td className="py-3 font-bold text-amber-500">★ {p.avg_rating || p.avgRating || 5}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p._id || p.product_id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDERS FULFILLMENT */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-ink">All Customer Orders ({orders.length})</h3>
            <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-ink-muted">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Fulfillment</th>
                    <th className="pb-3 font-semibold">Total Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {orders.map((o) => (
                    <tr key={o._id || o.order_id} className="hover:bg-surface-warm/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-primary">
                        #{String(o._id || o.order_id).slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-ink">{o.customer_name}</p>
                        <p className="text-[11px] text-ink-muted">{o.customer_phone}</p>
                      </td>
                      <td className="py-3 text-ink-muted capitalize">
                        {o.delivery_type || o.deliveryType}
                      </td>
                      <td className="py-3 font-bold text-ink font-serif">
                        ₹{parseFloat(o.total_amount || o.totalAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                            o.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : o.status === 'baking'
                              ? 'bg-amber-100 text-amber-800'
                              : o.status === 'out_for_delivery'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o._id || o.order_id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="baking">Baking</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. INVENTORY PANTRY */}
        {activeAdminTab === 'inventory' && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-ink">Bakehouse Pantry & Ingredients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map((item) => (
                <div
                  key={item._id || item.ingredient_id}
                  className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-ink">{item.name}</h4>
                      <p className="text-xs text-ink-muted">Threshold: {item.low_stock_threshold || item.lowStockThreshold} kg</p>
                    </div>
                    {item.is_low_stock && (
                      <span className="p-1.5 rounded-lg bg-red-100 text-red-700" title="Low Stock">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="text-3xl font-serif font-bold text-primary">
                    {item.quantity_kg || item.quantityKg} <span className="text-base text-ink-muted font-sans font-normal">Kg/Units</span>
                  </div>

                  <button
                    onClick={() => handleUpdateInventory(item._id || item.ingredient_id, item.quantity_kg || item.quantityKg)}
                    className="w-full py-2.5 rounded-xl bg-surface-card hover:bg-surface-warm border border-surface-border text-xs font-semibold text-ink transition-all"
                  >
                    Update Stock Quantity
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CUSTOMERS */}
        {activeAdminTab === 'customers' && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-ink">Customer Insights & Loyalty Tiers</h3>
            <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-ink-muted">
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Contact</th>
                    <th className="pb-3 font-semibold">Orders Count</th>
                    <th className="pb-3 font-semibold">Total Spend</th>
                    <th className="pb-3 font-semibold">Loyalty Tier</th>
                    <th className="pb-3 font-semibold">Account Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {customers.map((c) => (
                    <tr key={c._id || c.user_id} className="hover:bg-surface-warm/40 transition-colors">
                      <td className="py-3 font-bold text-ink">{c.fullName || c.full_name}</td>
                      <td className="py-3">
                        <p className="text-ink">{c.email}</p>
                        <p className="text-ink-muted text-[11px]">{c.phone}</p>
                      </td>
                      <td className="py-3 font-semibold text-ink">{c.total_orders || c.totalOrders || 0} orders</td>
                      <td className="py-3 font-serif font-bold text-primary">
                        ₹{(c.total_spend || c.totalSpend || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {c.tier}
                        </span>
                      </td>
                      <td className="py-3 font-mono uppercase text-[11px] font-bold text-ink-muted">
                        {c.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. REVIEWS MODERATION */}
        {activeAdminTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-ink">Customer Reviews Moderation ({reviews.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div
                  key={r._id || r.review_id}
                  className="bg-white rounded-3xl p-5 border border-surface-border shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-ink">{r.reviewer_name}</h4>
                      <p className="text-xs text-primary font-medium">{r.product_name}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.isApproved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted italic">"{r.comment}"</p>

                  <div className="flex gap-2 pt-2 border-t border-surface-border/60">
                    {!r.isApproved ? (
                      <button
                        onClick={() => handleModerateReview(r._id || r.review_id, true)}
                        className="px-3 py-1.5 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-all"
                      >
                        Approve Review
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerateReview(r._id || r.review_id, false)}
                        className="px-3 py-1.5 rounded-xl bg-stone-200 text-ink text-xs font-semibold hover:bg-stone-300 transition-all"
                      >
                        Hide Review
                      </button>
                    )}
                    <button
                      onClick={() => handleModerateReview(r._id || r.review_id, false, true)}
                      className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BUSINESS REPORTS */}
        {activeAdminTab === 'reports' && reports && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-ink">Bakery Analytics & Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs">
                <span className="text-xs text-ink-muted uppercase tracking-wider">Average Order Value</span>
                <p className="font-serif text-3xl font-bold text-ink mt-2">
                  ₹{reports.avg_order_value || reports.avgOrderValue || 0}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs">
                <span className="text-xs text-ink-muted uppercase tracking-wider">Total Lifetime Orders</span>
                <p className="font-serif text-3xl font-bold text-ink mt-2">
                  {reports.total_orders || reports.totalOrders || 0}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs">
                <span className="text-xs text-ink-muted uppercase tracking-wider">30-Day Customer Growth</span>
                <p className="font-serif text-3xl font-bold text-green-600 mt-2">
                  +{reports.customer_growth || reports.customerGrowth || 0} new
                </p>
              </div>
            </div>

            {/* Category Sales Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-lg text-ink">Sales Revenue by Category</h4>
              <div className="space-y-3">
                {(reports.category_sales || reports.categorySales || []).map((cat, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-ink">{cat.category_name}</span>
                    <span className="font-serif font-bold text-primary">₹{cat.revenue.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
