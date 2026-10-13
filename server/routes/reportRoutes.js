import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'cancelled' } })
      .populate('items.product')
      .populate('user', 'fullName')
      .lean();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Customers
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const newCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Category Sales
    const catMap = {};
    const categories = await Category.find().lean();
    categories.forEach((c) => {
      catMap[c._id.toString()] = { category_name: c.name, revenue: 0 };
    });

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const catId = item.product?.category?.toString();
        if (catId && catMap[catId]) {
          catMap[catId].revenue += item.quantity * item.unitPrice;
        }
      });
    });

    const categorySales = Object.values(catMap).sort((a, b) => b.revenue - a.revenue);

    // Location sales (derived from delivery addresses)
    const locMap = {};
    orders.forEach((o) => {
      if (o.deliveryAddress) {
        const loc = o.deliveryAddress.split(',')[0].trim();
        locMap[loc] = (locMap[loc] || 0) + o.totalAmount;
      }
    });

    const locationSales = Object.entries(locMap)
      .map(([location, revenue]) => ({ location, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // High value orders (top 5)
    const highValueOrders = [...orders]
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map((o) => {
        const name = o.user?.fullName || 'Customer';
        const parts = name.split(' ');
        const initials =
          parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();

        return {
          order_id: o._id,
          full_name: name,
          delivery_address: o.deliveryAddress,
          total_amount: o.totalAmount,
          initials,
          items_summary: o.items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
        };
      });

    res.json({
      total_orders: totalOrders,
      totalOrders,
      avg_order_value: Math.round(avgOrderValue * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      customer_growth: newCustomers,
      customerGrowth: newCustomers,
      total_customers: totalCustomers,
      totalCustomers,
      category_sales: categorySales,
      categorySales,
      location_sales: locationSales,
      locationSales,
      high_value_orders: highValueOrders,
      highValueOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
