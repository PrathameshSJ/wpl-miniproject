import express from 'express';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's revenue & orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: { $ne: 'cancelled' },
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Pending orders
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });

    // Low stock count
    const inventoryItems = await Inventory.find().lean();
    const lowStockCount = inventoryItems.filter(
      (item) => item.lowStockThreshold != null && item.quantityKg <= item.lowStockThreshold
    ).length;

    // Revenue last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const pastOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
      status: { $ne: 'cancelled' },
    });

    // Group by date (YYYY-MM-DD)
    const revByDay = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      revByDay[key] = 0;
    }

    pastOrders.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().split('T')[0];
      if (revByDay[key] !== undefined) {
        revByDay[key] += o.totalAmount;
      }
    });

    const revenue7days = Object.entries(revByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    // Recent orders (last 10)
    const recentOrdersDocs = await Order.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentOrders = recentOrdersDocs.map((o) => ({
      order_id: o._id,
      customer_name: o.user?.fullName || 'Guest',
      total_amount: o.totalAmount,
      status: o.status,
      created_at: o.createdAt,
      items_summary: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
    }));

    // Best sellers
    const allNonCancelled = await Order.find({ status: { $ne: 'cancelled' } }).lean();
    const productSales = {};

    allNonCancelled.forEach((o) => {
      o.items.forEach((item) => {
        if (!productSales[item.name]) {
          productSales[item.name] = { units_sold: 0, revenue: 0 };
        }
        productSales[item.name].units_sold += item.quantity;
        productSales[item.name].revenue += item.quantity * item.unitPrice;
      });
    });

    const bestSellers = Object.entries(productSales)
      .map(([name, data]) => ({
        name,
        units_sold: data.units_sold,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.units_sold - a.units_sold)
      .slice(0, 5);

    res.json({
      today_revenue: todayRevenue,
      todayRevenue,
      today_orders: todayOrders.length,
      todayOrders: todayOrders.length,
      pending_orders: pendingOrdersCount,
      pendingOrders: pendingOrdersCount,
      low_stock_count: lowStockCount,
      lowStockCount,
      revenue_7days: revenue7days,
      revenue7days,
      recent_orders: recentOrders,
      recentOrders,
      best_sellers: bestSellers,
      bestSellers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
