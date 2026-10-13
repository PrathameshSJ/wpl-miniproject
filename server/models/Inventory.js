import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantityKg: {
      type: Number,
      required: true,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.virtual('isLowStock').get(function () {
  return this.lowStockThreshold != null && this.quantityKg <= this.lowStockThreshold;
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

export default mongoose.model('Inventory', inventorySchema);
