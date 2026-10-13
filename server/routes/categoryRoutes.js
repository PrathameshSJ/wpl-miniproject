import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().lean();
    
    // Add product counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          isAvailable: true,
        });
        return {
          ...cat,
          category_id: cat._id,
          product_count: count,
          productCount: count,
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, iconUrl, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const category = await Category.create({ name, iconUrl, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
