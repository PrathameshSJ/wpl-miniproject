import express from 'express';
import Inventory from '../models/Inventory.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ name: 1 }).lean();
    const formatted = items.map((item) => ({
      ...item,
      ingredient_id: item._id,
      quantity_kg: item.quantityKg,
      low_stock_threshold: item.lowStockThreshold,
      is_low_stock: item.lowStockThreshold != null && item.quantityKg <= item.lowStockThreshold,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, quantity_kg, quantityKg, low_stock_threshold, lowStockThreshold } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Ingredient not found' });

    if (name) item.name = name;
    if (quantityKg !== undefined || quantity_kg !== undefined) {
      item.quantityKg = Number(quantityKg !== undefined ? quantityKg : quantity_kg);
    }
    if (lowStockThreshold !== undefined || low_stock_threshold !== undefined) {
      item.lowStockThreshold = Number(lowStockThreshold !== undefined ? lowStockThreshold : low_stock_threshold);
    }

    await item.save();
    res.json({ message: 'Inventory updated', item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
