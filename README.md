# 🧁 BakeEase — MERN Stack Edition

> **Online Artisanal Bakery Ordering & Delivery Platform**  
> Modern Full-Stack MERN Application (MongoDB · Express.js · React · Node.js)

[![SDG 8](https://img.shields.io/badge/SDG-8%20Decent%20Work%20%26%20Economic%20Growth-orange)](https://sdgs.un.org/goals/goal8)
[![Stack](https://img.shields.io/badge/Stack-MongoDB%20%2B%20Express%20%2B%20React%20%2B%20Node.js-green)](#)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20TailwindCSS-blue)](#)

---

## 📖 About

**BakeEase** has been completely upgraded from legacy PHP/MySQL to the modern **MERN Stack** (MongoDB, Express.js, React, Node.js). It digitises local Mumbai bakeries by providing a rich storefront, custom cake builder studio, online order checkout (Click & Collect or Delivery), real-time order status tracking, a Purble Palace-inspired **BakeMaster** arcade mini-game, and a comprehensive **Admin Management Suite**.

---

## 🛠️ Modern MERN Architecture

```
Frontend (React SPA)
├── Vite 6 + React 18 + TailwindCSS + Lucide Icons + Canvas-Confetti
├── Components: Navbar, Footer, CartDrawer, AuthModal, ProductDetailModal
└── Views:
    ├── Home (Hero, category pills, featured treats, promo banner, testimonials)
    ├── Menu / Catalogue (Live search, category pills, price range, sorting)
    ├── Custom Cake Studio (5-step interactive bespoke cake builder & live preview)
    ├── BakeMaster Game (Purble Palace-style arcade baking challenge)
    ├── Checkout (Fulfillment toggle, address, UPI/COD, coupon validation)
    ├── My Orders (Real-time 4-step baking progress tracker)
    ├── Contact & Feedback (Review submission directly to MongoDB)
    └── Admin Suite (KPIs, products, orders, inventory, customers, reviews, reports)

Backend (REST API)
├── Node.js LTS + Express.js 4 + Mongoose 8
├── JSON Web Token (JWT) + bcryptjs password hashing
├── In-Memory Fallback: Auto-starts embedded MongoDB if local instance is unavailable
└── Auto-Seeder: Migrated all 22 products, categories, reviews, users from bakeease.sql
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```
*(Or run `npm install` in root, `server/`, and `client/` respectively)*

### 2. Start Both Frontend & Backend Concurrently
```bash
npm run dev
```

- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@bakeease.in` | `admin123` | Storefront + Full Admin Control Suite |
| **Customer** | `priya@example.com` | `customer123` | Browsing, Cart, Checkout, Order Tracking |
| **Customer** | `rahul@example.com` | `customer123` | Browsing, Cart, Checkout, Order Tracking |

> **Tip:** The sign-in modal features 1-click **Demo Admin** and **Demo Customer** buttons for instant testing.

---

## 🎟️ Active Promo Code

- **Code:** `BAKE20`
- **Benefit:** 20% OFF on all orders above ₹500
- **Try it:** Enter `BAKE20` in the basket or checkout screen.

---

## 📦 Project Structure

```
├── client/                     # React Frontend (Vite + TailwindCSS)
│   ├── public/images/          # Product and ingredient assets (71 files)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, CartDrawer, AuthModal, etc.
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── views/              # HomeView, MenuView, CustomCakeView, GameView, CheckoutView, OrdersView, AdminView
│   │   ├── api.js              # Central API client
│   │   ├── App.jsx             # Main application router
│   │   └── index.css           # Styling
│   └── package.json
│
├── server/                     # Express.js + MongoDB Backend
│   ├── config/                 # db.js (Mongoose connection + in-memory fallback)
│   ├── middleware/             # auth.js (JWT protect & adminOnly)
│   ├── models/                 # User, Product, Category, Order, Review, Inventory, Coupon, ContactMessage, Setting
│   ├── routes/                 # auth, products, orders, categories, reviews, inventory, coupons, dashboard, reports, customers
│   ├── seed.js                 # Seed script with SQL data
│   ├── server.js               # Express application entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
├── legacy/                     # Archived Legacy Code (PHP & HTML for reference)
│   ├── server-php/
│   ├── client-html/
│   └── admin-html/
│
├── bakeease.sql                # Original MySQL dump reference
├── howtorun.txt                # Quick execution guide
└── package.json                # Monorepo scripts
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create customer account | Public |
| `POST` | `/api/auth/login` | Authenticate & get JWT token | Public |
| `GET` | `/api/auth/me` | Current user profile | Bearer Token |
| `GET` | `/api/categories` | List categories with counts | Public |
| `GET` | `/api/products` | List & filter products | Public |
| `POST` | `/api/products` | Add new product | Admin |
| `GET` | `/api/orders` | Orders list (customer or all) | Bearer Token |
| `POST` | `/api/orders` | Place new order | Customer |
| `PATCH` | `/api/orders/:id` | Update order status | Admin |
| `GET` | `/api/reviews` | Top testimonials or by product | Public / Admin |
| `POST` | `/api/reviews` | Submit product review | Customer |
| `GET` | `/api/inventory` | Stock quantities & low stock alerts | Public / Admin |
| `PUT` | `/api/inventory/:id` | Restock ingredient quantity | Admin |
| `POST` | `/api/coupons` | Validate coupon discount | Public |
| `GET` | `/api/dashboard` | Admin KPIs & 7-day sales | Admin |
| `GET` | `/api/reports` | Business analytics & metrics | Admin |
| `GET` | `/api/customers` | Customer loyalty & spend | Admin |
| `GET` | `/api/settings` | Store hours & contact | Public |
