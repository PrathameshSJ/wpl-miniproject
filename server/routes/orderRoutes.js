import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET orders
router.get('/', protect, async (req, res) => {
  try {
    const isMyOrders = req.query.my === '1' || req.user.role !== 'admin';

    if (isMyOrders) {
      const orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name imageUrl basePrice')
        .sort({ createdAt: -1 })
        .lean();

      const formatted = orders.map((o) => ({
        ...o,
        order_id: o._id,
        total_amount: o.totalAmount,
        delivery_type: o.deliveryType,
        delivery_address: o.deliveryAddress,
        scheduled_at: o.scheduledAt,
        created_at: o.createdAt,
        customer_name: req.user.fullName,
      }));

      return res.json(formatted);
    }

    // Admin: all orders
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'fullName email phone')
      .populate('items.product', 'name imageUrl basePrice')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = orders.map((o) => ({
      ...o,
      order_id: o._id,
      total_amount: o.totalAmount,
      delivery_type: o.deliveryType,
      delivery_address: o.deliveryAddress,
      scheduled_at: o.scheduledAt,
      created_at: o.createdAt,
      customer_name: o.user?.fullName || 'Guest',
      customer_email: o.user?.email || '',
      customer_phone: o.user?.phone || '',
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, delivery_type, deliveryType, delivery_address, deliveryAddress, scheduled_at, scheduledAt, payment_method, paymentMethod } = req.body;

    const delType = deliveryType || delivery_type;
    const delAddress = deliveryAddress || delivery_address;
    const schedAt = scheduledAt || scheduled_at;
    const payMethod = paymentMethod || payment_method || 'cod';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }
    if (!delType) {
      return res.status(400).json({ error: 'Delivery type is required' });
    }

    // Validate and build item array
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const prodId = item.product_id || item.product || item._id;
      const product = await Product.findById(prodId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${prodId}` });
      }

      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(product.basePrice);
      total += unitPrice * qty;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: qty,
        unitPrice,
        customisation: item.customisation || null,
      });

      // Decrement stock if available
      if (product.stockQuantity >= qty) {
        product.stockQuantity -= qty;
        await product.save();
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      status: 'pending',
      deliveryType: delType,
      deliveryAddress: delAddress || '',
      scheduledAt: schedAt ? new Date(schedAt) : null,
      payment: {
        method: payMethod,
        status: payMethod === 'cod' ? 'pending' : 'pending',
        transactionId: payMethod === 'upi' ? `TXN_${Date.now()}` : null,
      },
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order_id: order._id,
      order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH order status
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'baking', 'out_for_delivery', 'completed', 'cancelled'];

    if (!status || !valid.includes(status)) {
      return res.status(400).json({ error: 'Valid status required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    if (status === 'completed' && order.payment.status === 'pending') {
      order.payment.status = 'success';
      order.payment.paidAt = new Date();
    }

    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
