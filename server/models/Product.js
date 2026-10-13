import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: 'chocolate-truffle-cake.png',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 20,
    },
    avgRating: {
      type: Number,
      default: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
