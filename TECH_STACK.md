# ⚙️ BakeEase — Tech Stack Document

> **Project:** BakeEase — Online Bakery Ordering & Delivery Platform
> **Team:** Team of 3 | Web Programming Lab | March 2026

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Stack](#2-frontend-stack)
3. [Backend Stack](#3-backend-stack)
4. [Database](#4-database)
5. [Authentication Strategy](#5-authentication-strategy)
6. [Payment Integration — Razorpay](#6-payment-integration--razorpay)
7. [Development Environment](#7-development-environment)
8. [Team Division of Work](#8-team-division-of-work)
9. [Figma Design Checklist](#9-figma-design-checklist-mid-term)
10. [PPT Slide Outline](#10-ppt-slide-outline-mid-term)

---

## 1. Architecture Overview

BakeEase follows a standard **three-tier web architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│           React 18 + Vite 5 + TailwindCSS                │
│         React Router · Zustand · Axios                   │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTPS / REST API (JSON)
┌──────────────────────▼──────────────────────────────────┐
│                  BACKEND SERVER                          │
│              Node.js + Express.js                        │
│      JWT Auth · Razorpay · Cloudinary · Multer           │
└──────────────────────┬──────────────────────────────────┘
                       │  mysql2 connection pool
┌──────────────────────▼──────────────────────────────────┐
│                    DATABASE                              │
│                    MySQL 8                               │
│         9 tables · FK constraints · ENUM types          │
└─────────────────────────────────────────────────────────┘
```

### Layer Summary

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React 18 + Vite 5 + TailwindCSS | UI, routing, state management |
| Backend | Node.js + Express.js | REST API, business logic, auth |
| Database | MySQL 8 | Persistent data storage |
| Auth | JWT + bcrypt | Session tokens, password hashing |
| Payments | Razorpay | UPI & COD payments for Indian users |
| File Storage | Cloudinary | Product image upload and CDN delivery |
| Dev Tools | ESLint, Prettier, Git/GitHub | Code quality, version control |

---

## 2. Frontend Stack

### 2.1 Core Packages

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.x | UI component framework |
| `vite` | 5.x | Fast dev server and build tool |
| `react-router-dom` | 6.x | Client-side routing between pages |
| `tailwindcss` | 3.x | Utility-first CSS for fast responsive styling |
| `zustand` | 4.x | Lightweight global state (cart, auth, user session) |
| `axios` | 1.x | HTTP client with request/response interceptors |
| `react-hook-form` | 7.x | Form handling and validation |
| `zod` | 3.x | Schema-based validation paired with React Hook Form |
| `lucide-react` | latest | Consistent icon library matching the design system |
| `recharts` | 2.x | Charts for the admin sales dashboard |
| `react-hot-toast` | 2.x | Toast notifications for order/cart/auth feedback |

### 2.2 Frontend Folder Structure

```
src/
├── assets/              # Fonts, images, SVG illustrations
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── StarRating.jsx
│   ├── CartDrawer.jsx
│   └── ...
├── pages/               # Page-level components
│   ├── Home.jsx
│   ├── Catalogue.jsx
│   ├── ProductDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Checkout.jsx
│   ├── Dashboard.jsx
│   ├── Contact.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── ManageProducts.jsx
│       └── ManageOrders.jsx
├── game/                # BakeMaster mini-game
│   ├── GameCanvas.jsx
│   ├── IngredientTray.jsx
│   ├── OrderCard.jsx
│   └── gameLogic.js
├── store/               # Zustand global stores
│   ├── cartStore.js
│   ├── authStore.js
│   └── orderStore.js
├── hooks/               # Custom React hooks
│   ├── useProducts.js
│   ├── useAuth.js
│   └── useCart.js
├── services/            # API call functions
│   ├── productService.js
│   ├── orderService.js
│   ├── authService.js
│   └── paymentService.js
├── utils/               # Helper functions
│   ├── formatCurrency.js
│   ├── debounce.js
│   └── validators.js
└── router/              # React Router config + protected routes
    ├── AppRouter.jsx
    └── ProtectedRoute.jsx
```

---

## 3. Backend Stack

### 3.1 Core Packages

| Package | Version | Purpose |
|---|---|---|
| `node` | 20 LTS | JavaScript runtime — same language as frontend |
| `express` | 4.x | Minimal REST API framework |
| `mysql2` | 3.x | MySQL driver with promise/async support |
| `jsonwebtoken` | 9.x | JWT generation and verification |
| `bcryptjs` | 2.x | Password hashing (10 salt rounds) |
| `dotenv` | 16.x | Environment variable management via `.env` |
| `cors` | 2.x | Enable cross-origin requests from frontend |
| `multer` | 1.x | File upload middleware for product images |
| `cloudinary` | 2.x | Upload processed images to Cloudinary CDN |
| `express-validator` | 7.x | Server-side input validation and sanitisation |
| `razorpay` | 2.x | Official Razorpay Node SDK for UPI payments |

### 3.2 Backend Folder Structure

```
server/
├── routes/              # API route definitions
│   ├── auth.routes.js
│   ├── products.routes.js
│   ├── orders.routes.js
│   ├── payments.routes.js
│   ├── reviews.routes.js
│   └── contact.routes.js
├── controllers/         # Business logic handlers
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── paymentController.js
├── middleware/          # Express middleware
│   ├── authMiddleware.js      # JWT verification
│   ├── adminMiddleware.js     # Role check
│   ├── errorHandler.js        # Global error handler
│   └── uploadMiddleware.js    # Multer config
├── models/              # Raw SQL query functions (no ORM)
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
├── config/              # Configuration files
│   ├── db.js                  # mysql2 connection pool
│   ├── cloudinary.js          # Cloudinary setup
│   └── razorpay.js            # Razorpay instance
├── utils/
│   ├── generateToken.js
│   └── emailHelper.js
├── app.js               # Express app setup
└── server.js            # HTTP server entry point
```

### 3.3 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/products` | Public | Get all products (supports `?category`, `?search`, `?sort`, `?page`) |
| `GET` | `/api/products/:id` | Public | Get single product details |
| `POST` | `/api/products` | Admin | Create new product (with image upload) |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |
| `GET` | `/api/categories` | Public | Get all categories |
| `POST` | `/api/orders` | Customer | Place a new order |
| `GET` | `/api/orders/my` | Customer | Get own order history |
| `GET` | `/api/orders` | Admin | Get all orders (filterable by status/date) |
| `PATCH` | `/api/orders/:id/status` | Admin | Update order status |
| `POST` | `/api/payments/create` | Customer | Create Razorpay order for UPI |
| `POST` | `/api/payments/verify` | Customer | Verify Razorpay payment signature |
| `POST` | `/api/reviews` | Customer | Submit a product review |
| `GET` | `/api/reviews/:productId` | Public | Get approved reviews for a product |
| `POST` | `/api/contact` | Public | Submit feedback/contact form |
| `POST` | `/api/coupons/apply` | Customer | Validate and apply a coupon code |
| `GET` | `/api/admin/reports/sales` | Admin | Daily/monthly sales data |
| `GET` | `/api/admin/inventory` | Admin | View inventory stock levels |

---

## 4. Database

### 4.1 Technology: MySQL 8

MySQL was chosen because:

- Relational structure with strict FK constraints fits the domain well
- Strong support for `ENUM` types, `JSON` columns (for customisation data), and transactions
- Widely taught in web programming curricula — fits the lab context
- Free and easy to run locally with MySQL Workbench or XAMPP

> **Alternative considered:** PostgreSQL (equally valid; MySQL chosen for familiarity and simplicity)

### 4.2 Connection Strategy

The backend uses a **mysql2 connection pool** (max 10 connections) rather than a single connection, to handle concurrent requests without blocking:

```js
// config/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
```

### 4.3 Sample `.env` File

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bakeease

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit `.env` to Git.** Add it to `.gitignore` immediately.

---

## 5. Authentication Strategy

```
Client                          Server
  │                               │
  │─── POST /api/auth/login ─────▶│
  │    { email, password }        │  1. Find user by email
  │                               │  2. bcrypt.compare(password, hash)
  │◀── { token, user } ──────────│  3. Sign JWT { userId, role }
  │                               │
  │  [stores token in localStorage]
  │                               │
  │─── GET /api/orders/my ───────▶│
  │    Authorization: Bearer <token>  4. authMiddleware verifies token
  │                               │  5. Attaches req.user = { userId, role }
  │◀── { orders: [...] } ────────│  6. Returns protected data
```

**Key decisions:**

- Token stored in `localStorage` (acceptable for lab; use `httpOnly` cookies for production)
- Token payload: `{ userId, role, iat, exp }`
- Token expiry: `7 days`
- Admin routes additionally checked by `adminMiddleware` — returns `403` if `role !== 'admin'`
- Passwords hashed with `bcrypt` at **10 salt rounds** before storage

---

## 6. Payment Integration — Razorpay

Razorpay is the recommended payment gateway for Indian applications. It supports UPI, GPay, PhonePe, Paytm, and card payments natively.

### 6.1 UPI Payment Flow

```
Customer                  Frontend                    Backend              Razorpay
    │                        │                            │                    │
    │── clicks "Pay Now" ──▶ │                            │                    │
    │                        │── POST /payments/create ──▶│                    │
    │                        │                            │── create order ───▶│
    │                        │                            │◀─ { orderId } ────│
    │                        │◀── { orderId, amount } ───│                    │
    │                        │                            │                    │
    │                        │  [opens Razorpay modal]    │                    │
    │── completes UPI ──────▶│                            │                    │
    │                        │◀─── { paymentId,          │                    │
    │                        │       orderId, signature } │                    │
    │                        │── POST /payments/verify ──▶│                    │
    │                        │                            │  verify HMAC-SHA256│
    │                        │                            │  mark order paid   │
    │                        │◀── { success: true } ─────│                    │
    │◀─── order confirmed ───│                            │                    │
```

**COD flow:** Customer selects COD at checkout → order is directly created with `status: 'pending'` and `payment.status: 'pending'` — no Razorpay call needed.

> 💡 Use **Razorpay Test Mode** for the lab submission. No real money is charged. Test UPI ID: `success@razorpay`

---

## 7. Development Environment

### 7.1 Tools

| Tool | Purpose |
|---|---|
| **VS Code** | Primary IDE — install: ESLint, Prettier, Tailwind CSS IntelliSense extensions |
| **Node.js 20 LTS** | Backend runtime — install from [nodejs.org](https://nodejs.org) |
| **MySQL Workbench** | GUI to create and manage the local database |
| **Git + GitHub** | Version control — each team member works on a feature branch |
| **Postman** | Test API endpoints before connecting to frontend |
| **Figma (Free)** | Design mockups for the 4 mid-term pages |

### 7.2 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-org/bakeease.git
cd bakeease

# --- Frontend ---
cd client
npm install
cp .env.example .env          # fill in VITE_API_URL
npm run dev                   # starts on http://localhost:5173

# --- Backend ---
cd ../server
npm install
cp .env.example .env          # fill in DB credentials, JWT secret, Razorpay keys
npm run dev                   # starts on http://localhost:5000
```

### 7.3 Branching Strategy

```
main                   → production-ready code only
dev                    → integration branch
feature/homepage       → Member 1's frontend work
feature/api-products   → Member 2's backend work
feature/cart-game      → Member 3's frontend work
```

> Create a Pull Request into `dev` when a feature is done. Merge `dev` into `main` for submissions.

---

## 8. Team Division of Work

| Member | Primary Area | Tasks |
|---|---|---|
| **Member 1** | Frontend – Core Pages | Homepage, Catalogue, Login/Register, Feedback pages; Navbar, Footer, shared components |
| **Member 2** | Backend + Database | MySQL schema, Express API, auth routes, product/order/payment endpoints, Razorpay integration |
| **Member 3** | Frontend – Features + Game | Cart, Checkout, Order Dashboard, Admin Panel UI, BakeMaster mini-game, Recharts dashboard |

---

## 9. Figma Design Checklist (Mid-Term)

Design both **mobile (375px)** and **desktop (1280px)** frames for each page.

| Page | Key Elements to Include | Status |
|---|---|---|
| Registration / Login | Form fields, validation states, tab switcher, CTA button, logo | ☐ |
| Homepage / Landing | Navbar, Hero, Category pills, Product grid (4 cards), Promo banner, Footer | ☐ |
| Product Catalogue & Search | Sidebar filters, search bar, sort dropdown, product card grid | ☐ |
| Feedback / Contact Us | Contact info card, feedback form with star rating, FAQ accordion | ☐ |

---

## 10. PPT Slide Outline (Mid-Term)

> Maximum **10 slides**. Visual-heavy, text-light. Use BakeEase warm brown colour scheme (`#B05E2D`).

| # | Slide Title | Content |
|---|---|---|
| 1 | Title Slide | Project name, team names, course, date |
| 2 | Problem Statement | Pain points of local Mumbai bakeries; why digital ordering matters |
| 3 | SDG Context | SDG 8 – Decent Work & Economic Growth; how BakeEase supports small business digitisation |
| 4 | Objectives | 5–6 bullet goals of the project |
| 5 | UI Design – Registration / Login | Figma screenshot(s) |
| 6 | UI Design – Homepage | Figma screenshot(s) |
| 7 | UI Design – Catalogue & Contact Us | Figma screenshots side by side |
| 8 | Database Schema | ER diagram or 9-table summary with relationships |
| 9 | Tech Stack | Visual diagram: React + Vite → Express → MySQL; icons for each tool |
| 10 | Future Scope / Conclusion | Full project features, BakeMaster game, SDG impact summary |

---

*BakeEase — Web Programming Lab Mini Project | SDG 8 | March 2026*
