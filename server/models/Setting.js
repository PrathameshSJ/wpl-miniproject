import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    bakeryName: {
      type: String,
      default: 'BakeEase Artisan Bakery',
    },
    contactEmail: {
      type: String,
      default: 'hello@bakeease.in',
    },
    phoneNumber: {
      type: String,
      default: '+91 98765 43210',
    },
    address: {
      type: String,
      default: '122 Artisan Lane, Bandra West, Mumbai 400050',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    hours: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        Monday: { open: '07:00', close: '21:00', status: 'Open' },
        Tuesday: { open: '07:00', close: '21:00', status: 'Open' },
        Wednesday: { open: '07:00', close: '21:00', status: 'Open' },
        Thursday: { open: '07:00', close: '21:00', status: 'Open' },
        Friday: { open: '07:00', close: '22:00', status: 'Open' },
        Saturday: { open: '07:00', close: '22:00', status: 'Open' },
        Sunday: { open: '08:00', close: '20:00', status: 'Open' },
      }),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Setting', settingSchema);
