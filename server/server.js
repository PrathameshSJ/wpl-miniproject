import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import { connectDB } from './config/db.js';
import { seedData } from './seed.js';
import Product from './models/Product.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images from client public/images and legacy images
const clientImagesPath = path.join(__dirname, '../client/public/images');
const fallbackImagesPath = path.join(__dirname, '../client/images');
app.use('/images', express.static(clientImagesPath));
app.use('/images', express.static(fallbackImagesPath));
app.use('/client/images', express.static(clientImagesPath));
app.use('/client/images', express.static(fallbackImagesPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingRoutes);

// Backward compatibility alias for legacy PHP requests if any: /bakeease/server/api/*
app.use('/bakeease/server/api/auth.php', authRoutes);
app.use('/bakeease/server/api/categories.php', categoryRoutes);
app.use('/bakeease/server/api/products.php', productRoutes);
app.use('/bakeease/server/api/orders.php', orderRoutes);
app.use('/bakeease/server/api/reviews.php', reviewRoutes);
app.use('/bakeease/server/api/inventory.php', inventoryRoutes);
app.use('/bakeease/server/api/coupons.php', couponRoutes);
app.use('/bakeease/server/api/contact.php', contactRoutes);
app.use('/bakeease/server/api/dashboard.php', dashboardRoutes);
app.use('/bakeease/server/api/reports.php', reportRoutes);
app.use('/bakeease/server/api/customers.php', customerRoutes);
app.use('/bakeease/server/api/settings.php', settingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'BakeEase MERN Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: '🧁 Welcome to BakeEase MERN API Server',
    documentation: 'See README.md for endpoint details',
    health: '/api/health',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is freshly started
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('📦 Database is empty. Running initial auto-seed...');
      await seedData();
    }

    app.listen(PORT, () => {
      console.log(`🚀 BakeEase Express Server running on http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
