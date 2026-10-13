import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  customisation: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['upi', 'cod'],
    default: 'cod',
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    default: null,
  },
  paidAt: {
    type: Date,
    default: null,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'baking', 'out_for_delivery', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryType: {
      type: String,
      enum: ['delivery', 'pickup'],
      default: 'delivery',
    },
    deliveryAddress: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    payment: {
      type: paymentSchema,
      default: () => ({ method: 'cod', status: 'pending' }),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', orderSchema);
