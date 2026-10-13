import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { top, product_id, productId } = req.query;
    const prodId = productId || product_id;

    if (top) {
      const topReviews = await Review.find({ isApproved: true })
        .populate('product', 'name')
        .sort({ rating: -1, createdAt: -1 })
        .limit(6)
        .lean();

      return res.json(
        topReviews.map((r) => ({
          ...r,
          review_id: r._id,
          reviewer_name: r.reviewerName,
          product_name: r.product?.name || 'Artisan Bakery',
          created_at: r.createdAt,
        }))
      );
    }

    if (prodId) {
      const reviews = await Review.find({ product: prodId, isApproved: true })
        .sort({ createdAt: -1 })
        .lean();

      return res.json(
        reviews.map((r) => ({
          ...r,
          review_id: r._id,
          reviewer_name: r.reviewerName,
          created_at: r.createdAt,
        }))
      );
    }

    // Admin: all reviews
    const allReviews = await Review.find()
      .populate('product', 'name')
      .populate('user', 'fullName')
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      allReviews.map((r) => ({
        ...r,
        review_id: r._id,
        reviewer_name: r.reviewerName || r.user?.fullName,
        product_name: r.product?.name || 'Bakery Item',
        created_at: r.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { product_id, productId, rating, comment } = req.body;
    const prodId = productId || product_id;

    if (!prodId || !rating) {
      return res.status(400).json({ error: 'product_id and rating are required' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: prodId,
      reviewerName: req.user.fullName,
      rating: Number(rating),
      comment: comment || '',
      isApproved: false,
    });

    res.status(201).json({ message: 'Review submitted for approval', review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { is_approved, isApproved, delete: shouldDelete } = req.body;

    if (shouldDelete) {
      await Review.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Review deleted' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (isApproved !== undefined || is_approved !== undefined) {
      review.isApproved = isApproved !== undefined ? Boolean(isApproved) : Number(is_approved) === 1;
      await review.save();

      // Recalculate product rating
      const approved = await Review.find({ product: review.product, isApproved: true });
      const avg = approved.length ? approved.reduce((s, r) => s + r.rating, 0) / approved.length : 5;
      await Product.findByIdAndUpdate(review.product, {
        avgRating: avg,
        reviewCount: approved.length,
      });

      return res.json({ message: 'Review updated', review });
    }

    res.status(400).json({ error: 'No valid action provided' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
