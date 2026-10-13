import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { code, cart_total, cartTotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required' });

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) return res.status(404).json({ error: 'Invalid or inactive coupon' });

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return res.status(410).json({ error: 'Coupon has expired' });
    }

    const total = Number(cartTotal !== undefined ? cartTotal : cart_total) || 0;
    if (coupon.minOrderValue && total < coupon.minOrderValue) {
      return res.status(400).json({
        error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}`,
      });
    }

    const discount = Math.round(((total * coupon.discountPct) / 100) * 100) / 100;
    res.json({
      valid: true,
      code: coupon.code,
      discount_pct: coupon.discountPct,
      discountPct: coupon.discountPct,
      discount_amt: discount,
      discountAmt: discount,
      new_total: total - discount,
      newTotal: total - discount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
