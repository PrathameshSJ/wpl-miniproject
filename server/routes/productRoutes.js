import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { protect, adminOnly } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../client/public/images'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = (req.body.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Single product or list
router.get('/', async (req, res) => {
  try {
    const { id, category, search, min_price, max_price, sort, limit = 50, offset = 0, all } = req.query;

    if (id) {
      const product = await Product.findById(id).populate('category', 'name iconUrl').lean();
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Reviews
      const reviews = await Review.find({ product: id, isApproved: true })
        .sort({ createdAt: -1 })
        .lean();
      
      const avg = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 5;

      return res.json({
        ...product,
        product_id: product._id,
        category_name: product.category?.name,
        category_icon: product.category?.iconUrl,
        avg_rating: avg,
        review_count: reviews.length,
        reviews,
      });
    }

    const filter = {};
    if (!all) {
      filter.isAvailable = true;
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const catDoc = await Category.findOne({
          $or: [{ name: new RegExp(category, 'i') }],
        });
        if (catDoc) filter.category = catDoc._id;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (min_price || max_price) {
      filter.basePrice = {};
      if (min_price) filter.basePrice.$gte = Number(min_price);
      if (max_price) filter.basePrice.$lte = Number(max_price);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { basePrice: 1 };
    else if (sort === 'price_desc') sortOption = { basePrice: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'popular') sortOption = { avgRating: -1, reviewCount: -1 };

    const total = await Product.countDocuments(filter);
    const productsDocs = await Product.find(filter)
      .populate('category', 'name iconUrl')
      .sort(sortOption)
      .skip(Number(offset))
      .limit(Math.min(Number(limit), 100))
      .lean();

    const products = productsDocs.map((p) => ({
      ...p,
      product_id: p._id,
      category_name: p.category?.name,
      category_icon: p.category?.iconUrl,
      avg_rating: p.avgRating || 5,
      review_count: p.reviewCount || 0,
      base_price: p.basePrice,
      image_url: p.imageUrl,
      is_available: p.isAvailable ? 1 : 0,
      stock_quantity: p.stockQuantity,
    }));

    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name iconUrl').lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const reviews = await Review.find({ product: req.params.id, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();

    const avg = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

    res.json({
      ...product,
      product_id: product._id,
      category_name: product.category?.name,
      category_icon: product.category?.iconUrl,
      avg_rating: parseFloat(avg),
      review_count: reviews.length,
      base_price: product.basePrice,
      image_url: product.imageUrl,
      is_available: product.isAvailable ? 1 : 0,
      stock_quantity: product.stockQuantity,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin create
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, category_id, category, base_price, basePrice, description, is_available, isAvailable, stock_quantity, stockQuantity, imageUrl } = req.body;

    const catId = category_id || category;
    const price = basePrice !== undefined ? Number(basePrice) : Number(base_price);
    const img = req.file ? req.file.filename : (imageUrl || 'chocolate-truffle-cake.png');

    if (!name || !catId || isNaN(price)) {
      return res.status(400).json({ error: 'Name, category, and base price are required' });
    }

    const product = await Product.create({
      name,
      category: catId,
      description: description || '',
      basePrice: price,
      imageUrl: img,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : (is_available !== undefined ? Number(is_available) === 1 : true),
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : (stock_quantity !== undefined ? Number(stock_quantity) : 20),
    });

    res.status(201).json({ message: 'Product created', product_id: product._id, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin update
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { name, category_id, category, base_price, basePrice, description, is_available, isAvailable, stock_quantity, stockQuantity, image_url, imageUrl } = req.body;

    if (name) product.name = name;
    if (category_id || category) product.category = category_id || category;
    if (basePrice !== undefined || base_price !== undefined) product.basePrice = Number(basePrice !== undefined ? basePrice : base_price);
    if (description !== undefined) product.description = description;
    if (isAvailable !== undefined || is_available !== undefined) {
      product.isAvailable = isAvailable !== undefined ? Boolean(isAvailable) : Number(is_available) === 1;
    }
    if (stockQuantity !== undefined || stock_quantity !== undefined) {
      product.stockQuantity = Number(stockQuantity !== undefined ? stockQuantity : stock_quantity);
    }
    if (req.file) {
      product.imageUrl = req.file.filename;
    } else if (imageUrl || image_url) {
      product.imageUrl = imageUrl || image_url;
    }

    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await Review.deleteMany({ product: req.params.id });
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
