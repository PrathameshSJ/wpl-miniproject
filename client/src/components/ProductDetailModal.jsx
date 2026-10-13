import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, ShoppingBag, Send, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch, getImageUrl } from '../api';

export default function ProductDetailModal({ product, onClose, onOpenAuth }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const prodId = product?.product_id || product?._id;

  useEffect(() => {
    if (!prodId) return;
    const fetchReviews = async () => {
      try {
        const data = await apiFetch(`/reviews?product_id=${prodId}`);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [prodId]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      await apiFetch('/reviews', {
        method: 'POST',
        body: {
          product_id: prodId,
          rating,
          comment,
        },
      });
      setReviewSubmitted(true);
      setComment('');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating = parseFloat(product.avg_rating || product.avgRating || 5).toFixed(1);
  const price = parseFloat(product.base_price || product.basePrice || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-surface-border relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-ink shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Gallery */}
        <div className="md:w-1/2 p-6 bg-surface-warm flex flex-col justify-between">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-surface-border mb-4">
            <img
              src={getImageUrl(product.image_url || product.imageUrl)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/chocolate-truffle-cake.png';
              }}
            />
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-surface-border/60">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
              Artisan Highlights
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-ink">
              <div className="flex items-center gap-1.5">
                <span>🌾</span>
                <span>Unbleached Flour</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🧈</span>
                <span>Pure French Butter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🌿</span>
                <span>No Artificial Preservatives</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🔥</span>
                <span>Fresh Morning Bake</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Reviews */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header & Category */}
            <div>
              {product.category_name && (
                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-full">
                  {product.category_icon} {product.category_name}
                </span>
              )}
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink mt-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink">{avgRating}</span>
                <span className="text-xs text-ink-muted">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-serif font-bold text-primary">
              ₹{price.toLocaleString('en-IN')}
            </div>

            {/* Description */}
            <p className="text-sm text-ink-muted leading-relaxed">
              {product.description ||
                'Crafted with premium slow-fermented organic ingredients, baked to absolute perfection in our stone-hearth oven.'}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-surface-border rounded-xl bg-surface-card overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-surface-warm text-ink transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-surface-warm text-ink transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add ₹{(price * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>

            {/* Customer Reviews Section */}
            <div className="pt-6 border-t border-surface-border space-y-4">
              <h4 className="font-serif font-bold text-lg text-ink">Customer Reviews</h4>

              {/* Reviews List */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {loadingReviews ? (
                  <p className="text-xs text-ink-muted">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-ink-muted italic">
                    No reviews yet. Be the first to share your experience!
                  </p>
                ) : (
                  reviews.map((r, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-card border border-surface-border/60 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-ink">{r.reviewer_name || 'Verified Customer'}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }, (_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${idx < r.rating ? 'fill-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-ink-muted italic">"{r.comment}"</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Box */}
              {reviewSubmitted ? (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Thank you! Your review has been submitted for approval.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink-muted">Rate this item:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-hidden"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={user ? 'Write a review...' : 'Sign in to write a review...'}
                      disabled={!user}
                      className="flex-1 px-3 py-2 rounded-xl border border-surface-border text-xs focus:outline-hidden focus:border-primary bg-surface-card"
                    />
                    <button
                      type={user ? 'submit' : 'button'}
                      onClick={!user ? onOpenAuth : undefined}
                      disabled={submittingReview}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>{user ? 'Post' : 'Sign In'}</span>
                    </button>
                  </div>
                  {reviewError && <p className="text-[11px] text-red-600">{reviewError}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
