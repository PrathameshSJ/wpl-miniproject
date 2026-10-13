import dotenv from 'dotenv';
dotenv.config();

import { connectDB, closeDB } from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Inventory from './models/Inventory.js';
import Coupon from './models/Coupon.js';
import ContactMessage from './models/ContactMessage.js';
import Setting from './models/Setting.js';

export const seedData = async () => {
  console.log('🌱 Starting BakeEase Database Seeding...');

  // 1. Clear existing data
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
    Order.deleteMany(),
    Review.deleteMany(),
    Inventory.deleteMany(),
    Coupon.deleteMany(),
    ContactMessage.deleteMany(),
    Setting.deleteMany(),
  ]);

  console.log('🧹 Cleared existing collections');

  // 2. Seed Users
  const admin = await User.create({
    fullName: 'Amit Kumar',
    email: 'admin@bakeease.in',
    phone: '9876543210',
    password: 'admin123',
    role: 'admin',
  });

  const customer1 = await User.create({
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    password: 'customer123',
    role: 'customer',
  });

  const customer2 = await User.create({
    fullName: 'Rahul Kapoor',
    email: 'rahul@example.com',
    phone: '9876543212',
    password: 'customer123',
    role: 'customer',
  });

  const customer3 = await User.create({
    fullName: 'Ananya Mehra',
    email: 'ananya@example.com',
    phone: '9876543213',
    password: 'customer123',
    role: 'customer',
  });

  const customer4 = await User.create({
    fullName: 'Siddharth Verma',
    email: 'sid@example.com',
    phone: '9876543214',
    password: 'customer123',
    role: 'customer',
  });

  console.log('✅ Seeded users (Admin: admin@bakeease.in / admin123, Customer: priya@example.com / customer123)');

  // 3. Seed Categories
  const catCakes = await Category.create({ name: 'Cakes', iconUrl: '🎂', description: 'Handcrafted signature artisanal cakes' });
  const catCupcakes = await Category.create({ name: 'Cupcakes', iconUrl: '🧁', description: 'Bite-sized velvet treats' });
  const catPastries = await Category.create({ name: 'Pastries', iconUrl: '🥐', description: 'Flaky buttery Parisian viennoiserie' });
  const catBread = await Category.create({ name: 'Bread', iconUrl: '🍞', description: 'Naturally fermented artisanal sourdough' });
  const catCustom = await Category.create({ name: 'Custom', iconUrl: '✨', description: 'Bespoke custom-made celebration cakes' });

  console.log('✅ Seeded categories');

  // 4. Seed Products
  const rawProducts = [
    { name: 'Classic Chocolate Cake', category: catCakes._id, description: 'Rich dark Belgian chocolate with silky ganache frosting', basePrice: 699, imageUrl: 'chocolate-truffle-cake.png', stockQuantity: 15, avgRating: 4.9, reviewCount: 8 },
    { name: 'Vanilla Dream Cake', category: catCakes._id, description: 'Light organic Madagascar vanilla sponge with swiss buttercream', basePrice: 599, imageUrl: 'classic-vanilla-bean-cake.png', stockQuantity: 22, avgRating: 4.8, reviewCount: 6 },
    { name: 'Red Velvet Cupcakes', category: catCupcakes._id, description: 'Box of 6 velvety crimson cupcakes with cream cheese frosting', basePrice: 349, imageUrl: 'red-velvet-cake.png', stockQuantity: 30, avgRating: 4.9, reviewCount: 12 },
    { name: 'Butter Croissant', category: catPastries._id, description: 'Flaky, golden, freshly baked French butter croissant', basePrice: 89, imageUrl: 'Croissants.png', stockQuantity: 50, avgRating: 5.0, reviewCount: 15 },
    { name: 'Multigrain Loaf', category: catBread._id, description: 'Healthy multigrain artisanal sandwich bread with toasted seeds', basePrice: 149, imageUrl: 'artisan-sourdough.png', stockQuantity: 25, avgRating: 4.7, reviewCount: 5 },
    { name: 'Custom Birthday Cake', category: catCustom._id, description: 'Fully customisable cake — size, sponge flavor, filling & message', basePrice: 999, imageUrl: 'custom-cake-preview.png', stockQuantity: 10, avgRating: 5.0, reviewCount: 18 },
    { name: 'Berry Vanilla Cloud', category: catCakes._id, description: 'Light sponge with organic vanilla and fresh seasonal berries', basePrice: 1250, imageUrl: 'berry-vanilla-cake.png', stockQuantity: 20, avgRating: 5.0, reviewCount: 9 },
    { name: 'Red Velvet Delight', category: catCakes._id, description: 'Crimson layers of velvety sponge with luscious cream cheese frosting', basePrice: 1100, imageUrl: 'red-velvet-delight.png', stockQuantity: 20, avgRating: 4.9, reviewCount: 11 },
    { name: 'Hazelnut Praline Cake', category: catCakes._id, description: 'Roasted hazelnut praline between layers of chocolate ganache sponge', basePrice: 949, imageUrl: 'hazelnut-praline-cake.png', stockQuantity: 20, avgRating: 4.8, reviewCount: 7 },
    { name: 'Blueberry Cheesecake', category: catCakes._id, description: 'New York style baked cheesecake with organic blueberry compote', basePrice: 899, imageUrl: 'blueberry-cheesecake.png', stockQuantity: 8, avgRating: 5.0, reviewCount: 14 },
    { name: 'Seasonal Fruit Cake', category: catCakes._id, description: 'Layered sponge cake adorned with the freshest handpicked fruits', basePrice: 749, imageUrl: 'seasonal-fruit-cake.png', stockQuantity: 20, avgRating: 4.7, reviewCount: 5 },
    { name: 'Luxury Belgian Chocolate', category: catCakes._id, description: 'Triple-layered 70% Belgian dark chocolate with raspberry ganache', basePrice: 1250, imageUrl: 'luxury-belgian-chocolate-cake.png', stockQuantity: 20, avgRating: 5.0, reviewCount: 16 },
    { name: 'Mango Mousse Cake', category: catCakes._id, description: 'Alphonso mango mousse on a delicate vanilla sponge base', basePrice: 950, imageUrl: 'mango-mousse.png', stockQuantity: 20, avgRating: 4.9, reviewCount: 8 },
    { name: 'Butterscotch Gold', category: catCakes._id, description: 'Crunchy butterscotch praline cake with homemade caramel drizzle', basePrice: 780, imageUrl: 'butterscotch-gold.png', stockQuantity: 20, avgRating: 4.6, reviewCount: 4 },
    { name: 'Chocolate Glazed Donut', category: catPastries._id, description: '70% dark Belgian chocolate glaze over light yeast-raised brioche dough', basePrice: 180, imageUrl: 'chocolate-glazed-donut.png', stockQuantity: 20, avgRating: 4.8, reviewCount: 6 },
    { name: 'Chocolate Eclairs', category: catPastries._id, description: 'Choux pastry filled with vanilla bean custard and dark chocolate glaze', basePrice: 150, imageUrl: 'chocolate-eclairs.png', stockQuantity: 20, avgRating: 4.9, reviewCount: 7 },
    { name: 'French Macarons Box', category: catPastries._id, description: 'Assorted gift box of 12 Parisian macarons in seasonal flavors', basePrice: 950, imageUrl: 'Macarons.png', stockQuantity: 10, avgRating: 5.0, reviewCount: 20 },
    { name: 'Walnut Brownies', category: catPastries._id, description: 'Dense fudgy brownies loaded with premium California walnuts', basePrice: 320, imageUrl: 'walnut-brownies.png', stockQuantity: 18, avgRating: 4.9, reviewCount: 13 },
    { name: 'Vanilla Dream Cupcakes', category: catCupcakes._id, description: 'Box of 6 artisanal cupcakes with Swiss vanilla buttercream', basePrice: 450, imageUrl: 'vanilla-cupcakes.png', stockQuantity: 20, avgRating: 4.8, reviewCount: 7 },
    { name: 'Assorted Cupcake Box', category: catCupcakes._id, description: 'Curated selection of 6 artisanal cupcakes with assorted frostings', basePrice: 850, imageUrl: 'assorted-cupcakes.png', stockQuantity: 20, avgRating: 4.9, reviewCount: 10 },
    { name: 'Artisan Sourdough Loaf', category: catBread._id, description: '48-hour fermented loaf with a thick caramelised crust and airy crumb', basePrice: 350, imageUrl: 'artisan-sourdough.png', stockQuantity: 12, avgRating: 5.0, reviewCount: 19 },
    { name: 'Artisan Loaves Selection', category: catBread._id, description: 'Assorted artisanal bread loaves baked fresh daily at 6 AM', basePrice: 450, imageUrl: 'artisan-loaves.png', stockQuantity: 20, avgRating: 4.8, reviewCount: 5 },
  ];

  const products = await Product.insertMany(rawProducts);
  console.log(`✅ Seeded ${products.length} products`);

  // 5. Seed Inventory
  await Inventory.insertMany([
    { name: 'Organic Flour', quantityKg: 50, lowStockThreshold: 10 },
    { name: 'Cane Sugar', quantityKg: 30, lowStockThreshold: 5 },
    { name: 'French Butter', quantityKg: 20, lowStockThreshold: 3 },
    { name: 'Cocoa Powder', quantityKg: 10, lowStockThreshold: 2 },
    { name: 'Farm Eggs (units)', quantityKg: 200, lowStockThreshold: 24 },
    { name: 'Madagascar Vanilla Extract', quantityKg: 5, lowStockThreshold: 1 },
  ]);
  console.log('✅ Seeded inventory');

  // 6. Seed Coupons
  await Coupon.create({
    code: 'BAKE20',
    discountPct: 20,
    minOrderValue: 500,
    validUntil: new Date('2028-12-31'),
    isActive: true,
  });
  console.log('✅ Seeded coupons (Code: BAKE20 for 20% off)');

  // 7. Seed Reviews
  const cakeProduct = products[0];
  const cheesecakeProduct = products[9];
  const sourdoughProduct = products[20];

  await Review.insertMany([
    {
      user: customer1._id,
      product: cakeProduct._id,
      reviewerName: 'Priya Sharma',
      rating: 5,
      comment: 'The Chocolate Truffle Cake was absolutely divine! Moist, rich, and the ganache was pure perfection.',
      isApproved: true,
    },
    {
      user: customer2._id,
      product: cakeProduct._id,
      reviewerName: 'Rahul Kapoor',
      rating: 5,
      comment: 'Ordered this for my wife’s birthday and she was over the moon. The presentation was gorgeous!',
      isApproved: true,
    },
    {
      user: customer3._id,
      product: cheesecakeProduct._id,
      reviewerName: 'Ananya Mehra',
      rating: 5,
      comment: 'The Blueberry Cheesecake is creamy, tangy, and dangerously addictive. Best in Mumbai!',
      isApproved: true,
    },
    {
      user: customer4._id,
      product: sourdoughProduct._id,
      reviewerName: 'Siddharth Verma',
      rating: 5,
      comment: 'Best sourdough in the city! Crust is perfectly crispy and the crumb is heavenly.',
      isApproved: true,
    },
  ]);
  console.log('✅ Seeded reviews');

  // 8. Seed Orders
  await Order.create({
    user: customer1._id,
    items: [
      { product: cakeProduct._id, name: cakeProduct.name, quantity: 1, unitPrice: cakeProduct.basePrice },
      { product: products[3]._id, name: products[3].name, quantity: 2, unitPrice: products[3].basePrice },
    ],
    totalAmount: cakeProduct.basePrice + products[3].basePrice * 2,
    status: 'completed',
    deliveryType: 'delivery',
    deliveryAddress: 'Apt 4B, Emerald Residency, Bandra West, Mumbai',
    payment: { method: 'upi', status: 'success', paidAt: new Date() },
  });

  await Order.create({
    user: customer2._id,
    items: [
      { product: products[2]._id, name: products[2].name, quantity: 2, unitPrice: products[2].basePrice },
    ],
    totalAmount: products[2].basePrice * 2,
    status: 'baking',
    deliveryType: 'delivery',
    deliveryAddress: '12, Kapoor Villa, Juhu Tara Road, Mumbai',
    payment: { method: 'cod', status: 'pending' },
  });

  await Order.create({
    user: customer3._id,
    items: [
      { product: products[5]._id, name: products[5].name, quantity: 1, unitPrice: products[5].basePrice, customisation: { size: '1.5 Kg', flavour: 'Belgian Chocolate', frosting: 'Buttercream', message: 'Happy Birthday!' } },
    ],
    totalAmount: products[5].basePrice,
    status: 'pending',
    deliveryType: 'pickup',
    payment: { method: 'upi', status: 'pending' },
  });

  console.log('✅ Seeded sample orders');

  // 9. Seed Settings
  await Setting.create({
    bakeryName: 'BakeEase Artisan Bakery',
    contactEmail: 'hello@bakeease.in',
    phoneNumber: '+91 98765 43210',
    address: '122 Artisan Lane, Bandra West, Mumbai 400050',
    currency: 'INR',
  });
  console.log('✅ Seeded settings');

  console.log('🎉 BakeEase Database Seeding Completed Successfully!');
};

// If run directly via node seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedData();
      await closeDB();
      process.exit(0);
    } catch (err) {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    }
  })();
}
