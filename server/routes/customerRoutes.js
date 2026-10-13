import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['customer', 'admin'] } })
      .sort({ createdAt: -1 })
      .lean();

    const customersWithStats = await Promise.all(
      users.map(async (u) => {
        const userOrders = await Order.find({
          user: u._id,
          status: { $ne: 'cancelled' },
        }).lean();

        const totalOrders = userOrders.length;
        const totalSpend = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        let tier = 'New Artisan';
        if (totalSpend > 5000) tier = 'Gold Crust Member';
        else if (totalSpend > 1000) tier = "Baker's Guild";
        else if (totalSpend > 0) tier = 'Sourdough Society';

        return {
          user_id: u._id,
          _id: u._id,
          full_name: u.fullName,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          role: u.role,
          created_at: u.createdAt,
          createdAt: u.createdAt,
          total_orders: totalOrders,
          totalOrders,
          total_spend: totalSpend,
          totalSpend,
          tier,
        };
      })
    );

    res.json(customersWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Valid role is required' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
