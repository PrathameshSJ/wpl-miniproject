# ⚙️ BakeEase — Tech Stack Document

> **Project:** BakeEase — Online Bakery Ordering & Delivery Platform
> **Team:** Team of 3 | Web Programming Lab | March 2026

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Stack — HTML, CSS, JavaScript](#2-frontend-stack--html-css-javascript)
3. [Backend Stack — Node.js + Express](#3-backend-stack--nodejs--express)
4. [Database — MySQL](#4-database--mysql)
5. [Authentication Strategy](#5-authentication-strategy)
6. [Payment Integration — Razorpay](#6-payment-integration--razorpay)
7. [Development Environment](#7-development-environment)
8. [Team Division of Work](#8-team-division-of-work)
9. [Figma Design Checklist](#9-figma-design-checklist-mid-term)
10. [PPT Slide Outline](#10-ppt-slide-outline-mid-term)

---

## 1. Architecture Overview

BakeEase follows a standard **three-tier web architecture**. The frontend is written in
plain HTML, CSS, and JavaScript — no frameworks, no build tools. Pages talk to the
backend via the browser's built-in `fetch()` API.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│              HTML5 + CSS3 + Vanilla JavaScript           │
│         fetch() API calls · localStorage · DOM API      │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP / REST API (JSON)
                       │  fetch('http://localhost:5000/api/...')
┌──────────────────────▼──────────────────────────────────┐
│                  BACKEND SERVER                          │
│              Node.js 20 LTS + Express.js 4               │
│         JWT Auth · Razorpay · Multer · bcrypt            │
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
| Frontend | HTML5 + CSS3 + Vanilla JS (ES6+) | All pages, UI interactions, API calls via `fetch()` |
| Backend | Node.js 20 LTS + Express.js 4 | REST API, business logic, authentication |
| Database | MySQL 8 | Persistent relational data storage |
| Auth | JWT + bcrypt | Session tokens in `localStorage`, password hashing |
| Payments | Razorpay | UPI (GPay, PhonePe, Paytm) and COD for Indian users |
| File Storage | Cloudinary | Product image uploads and CDN delivery |
| Dev Tools | VS Code + Live Server, Git/GitHub, Postman | Development and version control |

---

## 2. Frontend Stack — HTML, CSS, JavaScript

### 2.1 No Frameworks, No Build Tools

The entire frontend is handwritten HTML, CSS, and JavaScript. Every page is a
standalone `.html` file. Shared elements like the navbar and footer are injected
via a small JS helper function. There is **no npm, no bundler, and no compilation step**
on the frontend — just files you open in a browser.

### 2.2 What We Use

| Technology | How it's loaded | Purpose |
|---|---|---|
| HTML5 | — | Page structure and semantic markup |
| CSS3 | `<link>` tag | Styling — Flexbox, Grid, CSS Variables, transitions, animations |
| JavaScript ES6+ | `<script>` tag | DOM manipulation, form handling, `fetch()` API calls |
| CSS Custom Properties | Our own file | Design token system — colours, spacing, fonts as variables |
| `fetch()` API | Built-in to browser | HTTP requests to the backend (replaces Axios) |
| `localStorage` | Built-in to browser | Store JWT token and cart data on the client |
| Google Fonts | CDN `<link>` | Playfair Display + Inter fonts |
| Font Awesome 6 | CDN `<link>` | Icons throughout the UI |
| Chart.js 4 | CDN `<script>` | Bar and line charts on the admin sales dashboard |
| Razorpay Checkout.js | CDN `<script>` | Razorpay UPI payment modal |

> All external libraries are loaded from CDN — no `npm install` needed on the frontend.

### 2.3 CSS Architecture — Design Tokens via Custom Properties

We define all colours, fonts, and spacing in one `:root` block in `styles/variables.css`,
then every other CSS file uses these variables. This means changing the primary brand
colour is a one-line edit.

```css
/* styles/variables.css */
:root {
  /* Colours */
  --color-primary:        #B05E2D;
  --color-primary-dark:   #6B3A2A;
  --color-accent:         #F4A261;
  --color-background:     #FDF6EC;
  --color-surface:        #FFFFFF;
  --color-text-primary:   #1A1A1A;
  --color-text-secondary: #666666;
  --color-success:        #2D9966;
  --color-error:          #CC3333;
  --color-border:         #E8D5C4;

  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body:    'Inter', sans-serif;

  /* Spacing (8px base grid) */
  --space-1:  8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-6:  48px;
  --space-8:  64px;

  /* Border radius */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-pill: 24px;

  /* Shadows */
  --shadow-card:  0 2px 12px rgba(0, 0, 0, 0.08);
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.16);
}
```

Usage in any other CSS file:

```css
/* styles/components.css */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-surface);
  font-family: var(--font-body);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
}
```

### 2.4 JavaScript Architecture

We write **plain functions**, grouped into logical JS files. No classes, no frameworks,
no build step — just files loaded in order via `<script>` tags.

**`js/api.js` — central `fetch()` wrapper used by every page:**

```js
const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('bakeease_token');
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    ...options
  });

  if (res.status === 401) {
    // Token expired — log out and redirect
    localStorage.removeItem('bakeease_token');
    localStorage.removeItem('bakeease_user');
    window.location.href = '/login.html';
    return;
  }

  if (!res.ok) throw await res.json();
  return res.json();
}
```

**`js/cart.js` — cart state in `localStorage`:**

```js
function getCart() {
  return JSON.parse(localStorage.getItem('bakeease_cart') || '[]');
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem('bakeease_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = total;
}
```

**`js/components.js` — inject shared navbar/footer HTML:**

```js
async function loadNavbar() {
  const res = await fetch('/components/navbar.html');
  const html = await res.text();
  document.getElementById('navbar-placeholder').innerHTML = html;
  updateCartBadge();
  highlightActiveNavLink();
}

async function loadFooter() {
  const res = await fetch('/components/footer.html');
  const html = await res.text();
  document.getElementById('footer-placeholder').innerHTML = html;
}

function highlightActiveNavLink() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
}
```

### 2.5 Frontend Folder Structure

```
client/
├── index.html                  # Homepage
├── catalogue.html              # Product Catalogue & Search
├── product.html                # Single product detail
├── login.html                  # Login + Register (tab switcher)
├── checkout.html               # Cart + Checkout
├── dashboard.html              # User order tracking dashboard
├── contact.html                # Feedback & Contact Us
├── game.html                   # BakeMaster mini-game
│
├── admin/
│   ├── index.html              # Admin dashboard + sales charts
│   ├── products.html           # Manage products (CRUD)
│   └── orders.html             # View and update orders
│
├── components/                 # Shared HTML fragments (injected via JS)
│   ├── navbar.html
│   └── footer.html
│
├── styles/
│   ├── variables.css           # CSS custom properties — edit this first
│   ├── base.css                # CSS reset, body defaults, typography
│   ├── components.css          # Buttons, cards, inputs, modals, badges
│   ├── navbar.css
│   ├── footer.css
│   ├── home.css
│   ├── catalogue.css
│   ├── product.css
│   ├── login.css
│   ├── checkout.css
│   ├── dashboard.css
│   ├── contact.css
│   ├── game.css
│   └── admin.css
│
├── js/
│   ├── api.js                  # fetch() wrapper + auth header injection
│   ├── cart.js                 # Cart CRUD using localStorage
│   ├── auth.js                 # Login, register, logout, token management
│   ├── components.js           # loadNavbar() and loadFooter()
│   ├── home.js                 # Fetch and render featured + best-seller products
│   ├── catalogue.js            # Filters, search (debounced), sort, pagination
│   ├── product.js              # Single product page — options, add to cart, reviews
│   ├── checkout.js             # Checkout form + Razorpay UPI flow
│   ├── dashboard.js            # Order history + 4-step status tracker
│   ├── contact.js              # Feedback form submission + validation
│   ├── game.js                 # BakeMaster game engine
│   └── admin.js                # Admin CRUD operations + Chart.js rendering
│
└── assets/
    ├── images/                 # Product photos, logo, hero image
    └── icons/                  # Custom SVG icons (if any)
```

### 2.6 Standard HTML Page Template

Every `.html` file follows this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BakeEase — Page Name</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet" />

  <!-- Font Awesome icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

  <!-- Our CSS (always in this order) -->
  <link rel="stylesheet" href="styles/variables.css" />
  <link rel="stylesheet" href="styles/base.css" />
  <link rel="stylesheet" href="styles/components.css" />
  <link rel="stylesheet" href="styles/home.css" />  <!-- page-specific last -->
</head>
<body>

  <!-- Navbar injected here by components.js -->
  <div id="navbar-placeholder"></div>

  <main>
    <!-- Page content goes here -->
  </main>

  <!-- Footer injected here -->
  <div id="footer-placeholder"></div>

  <!-- JS (always at end of body, in this order) -->
  <script src="js/api.js"></script>
  <script src="js/cart.js"></script>
  <script src="js/components.js"></script>
  <script src="js/home.js"></script>  <!-- page-specific last -->
  <script>
    // Page init — runs after scripts load
    document.addEventListener('DOMContentLoaded', () => {
      loadNavbar();
      loadFooter();
      initHomePage(); // defined in home.js
    });
  </script>
</body>
</html>
```

### 2.7 Responsiveness — Mobile-First Media Queries

```css
/* styles/base.css — mobile-first approach */

/* Base styles apply to all screen sizes (mobile first: 375px+) */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;        /* 1 column on mobile */
  gap: var(--space-2);
}

@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);   /* 2 columns on tablet */
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);   /* 3 columns on desktop */
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);   /* 4 columns on wide desktop */
  }
}
```

---

## 3. Backend Stack — Node.js + Express

### 3.1 Core npm Packages

| Package | Version | Purpose |
|---|---|---|
| `express` | 4.x | REST API framework — routing and middleware |
| `mysql2` | 3.x | MySQL driver with promise/async support |
| `jsonwebtoken` | 9.x | JWT creation and verification |
| `bcryptjs` | 2.x | Password hashing (10 salt rounds) |
| `dotenv` | 16.x | Load `.env` variables into `process.env` |
| `cors` | 2.x | Allow requests from the HTML frontend (different port) |
| `multer` | 1.x | Handle `multipart/form-data` for image file uploads |
| `cloudinary` | 2.x | Upload images to Cloudinary CDN after multer |
| `express-validator` | 7.x | Server-side input validation + sanitisation |
| `razorpay` | 2.x | Official Razorpay Node.js SDK |
| `nodemon` *(dev)* | 3.x | Auto-restart server on file changes during development |

```bash
# Install all backend dependencies
npm install express mysql2 jsonwebtoken bcryptjs dotenv cors multer cloudinary express-validator razorpay
npm install --save-dev nodemon
```

### 3.2 Backend Folder Structure

```
server/
├── routes/
│   ├── auth.routes.js          # /api/auth/*
│   ├── products.routes.js      # /api/products/*
│   ├── categories.routes.js    # /api/categories/*
│   ├── orders.routes.js        # /api/orders/*
│   ├── payments.routes.js      # /api/payments/*
│   ├── reviews.routes.js       # /api/reviews/*
│   └── contact.routes.js       # /api/contact
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── paymentController.js
│
├── middleware/
│   ├── authMiddleware.js       # jwt.verify() → attaches req.user
│   ├── adminMiddleware.js      # checks req.user.role === 'admin'
│   ├── errorHandler.js         # global error handler (4-arg middleware)
│   └── uploadMiddleware.js     # multer + cloudinary upload config
│
├── models/                     # Raw SQL query functions — no ORM
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
│
├── config/
│   ├── db.js                   # mysql2 connection pool
│   ├── cloudinary.js           # cloudinary SDK config
│   └── razorpay.js             # razorpay instance
│
├── utils/
│   └── generateToken.js        # jwt.sign() helper
│
├── schema.sql                  # Full MySQL schema — import to create all tables
├── seed.sql                    # Sample categories + products seed data
├── .env                        # Secret keys — NEVER commit to Git
├── .env.example                # Blank template — commit this
├── package.json
├── app.js                      # Express app: middleware + route mounting
└── server.js                   # Entry point: app.listen()
```

### 3.3 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer |
| `POST` | `/api/auth/login` | Public | Login, receive JWT |
| `GET` | `/api/products` | Public | All products — supports `?category`, `?search`, `?sort`, `?page` |
| `GET` | `/api/products/:id` | Public | Single product detail |
| `POST` | `/api/products` | Admin | Create product (with image upload) |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |
| `GET` | `/api/categories` | Public | All categories |
| `POST` | `/api/orders` | Customer | Place new order |
| `GET` | `/api/orders/my` | Customer | Own order history |
| `GET` | `/api/orders` | Admin | All orders (filterable) |
| `PATCH` | `/api/orders/:id/status` | Admin | Update order status |
| `POST` | `/api/payments/create` | Customer | Create Razorpay order for UPI |
| `POST` | `/api/payments/verify` | Customer | Verify Razorpay HMAC signature |
| `POST` | `/api/reviews` | Customer | Submit product review |
| `GET` | `/api/reviews/:productId` | Public | Approved reviews for a product |
| `POST` | `/api/contact` | Public | Submit feedback/contact form |
| `POST` | `/api/coupons/apply` | Customer | Validate and apply a coupon code |
| `GET` | `/api/admin/reports/sales` | Admin | Daily and monthly sales data |
| `GET` | `/api/admin/inventory` | Admin | Ingredient stock levels |

### 3.4 CORS Setup

Because the HTML files are served by Live Server on port `5500` and the Express API runs
on port `5000`, CORS must be explicitly allowed:

```js
// app.js
const cors = require('cors');

app.use(cors({
  origin: 'http://127.0.0.1:5500',   // VS Code Live Server default
  credentials: true
}));
```

### 3.5 Sample `.env`

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bakeease_db

# JWT
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d

# Razorpay Test Mode (no real money)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
```

> ⚠️ Add `.env` to `.gitignore` immediately. Only commit `.env.example`.

---

## 4. Database — MySQL

### 4.1 Why MySQL

- Standard in web programming lab environments — likely already installed via XAMPP
- MySQL Workbench generates an ERD diagram automatically — useful for the PPT
- Relational + FK constraints match BakeEase's data model exactly
- phpMyAdmin (bundled with XAMPP) is an easy visual alternative to Workbench

### 4.2 Setup Options

| Option | Best for | Steps |
|---|---|---|
| **XAMPP** | Beginners — quickest setup | Install XAMPP → Start Apache + MySQL → Open phpMyAdmin → Create `bakeease_db` → Import `schema.sql` |
| **MySQL Workbench** | Visual ERD diagrams | Install MySQL Server + Workbench → Connect → Run `schema.sql` |
| **MySQL CLI** | Any setup | `mysql -u root -p` → `CREATE DATABASE bakeease_db;` → `USE bakeease_db;` → `source schema.sql;` |

### 4.3 Connection Pool

```js
// config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

module.exports = pool;
```

---

## 5. Authentication Strategy

```
Browser (plain HTML page)          Express Server
         │                                │
         │── POST /api/auth/login ───────▶│
         │   body: { email, password }    │  1. Query users table by email
         │                                │  2. bcrypt.compare(password, hash)
         │◀── { token, user } ───────────│  3. jwt.sign({ userId, role }, secret)
         │                                │
         │  localStorage.setItem(         │
         │    'bakeease_token', token)     │
         │  localStorage.setItem(         │
         │    'bakeease_user', JSON.stringify(user))
         │                                │
         │── GET /api/orders/my ─────────▶│
         │   Authorization: Bearer <tok>  │  4. authMiddleware: jwt.verify()
         │                                │  5. req.user = { userId, role }
         │◀── { orders: [...] } ─────────│  6. Controller runs, returns data
```

**Frontend protection — redirect non-logged-in users:**

```js
// At the top of dashboard.html's <script> — guard protected pages
const token = localStorage.getItem('bakeease_token');
if (!token) window.location.href = '/login.html';

// Admin pages — also check role
const user = JSON.parse(localStorage.getItem('bakeease_user') || '{}');
if (!token || user.role !== 'admin') window.location.href = '/index.html';
```

---

## 6. Payment Integration — Razorpay

### UPI Payment Flow

```
User clicks "Pay via UPI"
        │
        ▼
checkout.js → apiFetch('/payments/create', { amount, orderId })
        │
        ▼
Server creates Razorpay order
Returns: { razorpayOrderId, amount, currency: 'INR', key: 'rzp_test_...' }
        │
        ▼
Frontend opens Razorpay modal (loaded from CDN):

  const rzp = new Razorpay({
    key: data.key,
    amount: data.amount,
    currency: 'INR',
    order_id: data.razorpayOrderId,
    name: 'BakeEase',
    description: 'Bakery Order',
    handler: function(response) {
      // Verify on server before confirming order
      verifyPayment(response);
    },
    prefill: { name: user.name, email: user.email }
  });
  rzp.open();

        │
        ▼
User pays via GPay / PhonePe / Paytm
        │
        ▼
handler() calls apiFetch('/payments/verify', { ...response })
        │
        ▼
Server: crypto HMAC-SHA256 check → marks order paid → returns success
        │
        ▼
Frontend redirects to /dashboard.html with success message
```

**COD:** Skip Razorpay entirely — `POST /api/orders` with `payment_method: 'cod'`.

> 💡 Use **Razorpay Test Mode**. Test UPI: `success@razorpay`. No real money charged.

---

## 7. Development Environment

### 7.1 Required Tools

| Tool | Purpose | Install |
|---|---|---|
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com) |
| **Live Server** | Serve HTML with auto-reload (VS Code extension) | Extensions panel → search "Live Server" by Ritwick Dey |
| **Prettier** | Auto-format HTML/CSS/JS on save | Extensions panel → search "Prettier" |
| **Node.js 20 LTS** | Run Express backend | [nodejs.org](https://nodejs.org) |
| **XAMPP** | Run MySQL locally via phpMyAdmin | [apachefriends.org](https://apachefriends.org) |
| **Postman** | Test API routes without a frontend | [postman.com](https://postman.com) |
| **Git + GitHub Desktop** | Version control with a GUI | [desktop.github.com](https://desktop.github.com) |
| **Figma** | UI design and prototyping | [figma.com](https://figma.com) |

### 7.2 Running the Project Locally

```bash
# 1. Clone the repo
git clone https://github.com/your-org/bakeease.git
cd bakeease

# 2. Set up the database
#    Start XAMPP → Start MySQL → Open phpMyAdmin
#    Create database: bakeease_db
#    Import: server/schema.sql  (creates all 9 tables)
#    Import: server/seed.sql    (adds sample categories + products)

# 3. Start the backend
cd server
npm install
cp .env.example .env        # fill in DB credentials and keys
node server.js
# → Server running on http://localhost:5000

# 4. Open the frontend
#    In VS Code: right-click client/index.html → "Open with Live Server"
#    → Opens http://127.0.0.1:5500/client/index.html
```

> The frontend (port 5500) and backend (port 5000) run on different ports.
> This is expected and is why the CORS configuration in `app.js` is required.

### 7.3 Branching Strategy

```
main                        ← stable, only updated for submissions
dev                         ← team integration branch
feature/html-css-pages      ← Member 1: all HTML + CSS files
feature/backend-api         ← Member 2: Express server + MySQL
feature/js-interactions-game ← Member 3: all JS files + game
```

> Create a **Pull Request** into `dev` when a feature branch is done.
> Only merge `dev` → `main` for final submissions.

---

## 8. Team Division of Work

| Member | Area | What they write |
|---|---|---|
| **Member 1** | HTML + CSS | All `.html` page files, all `.css` files — `variables.css`, `base.css`, `components.css`, and every page-specific stylesheet. Also writes `components/navbar.html` and `components/footer.html` |
| **Member 2** | Backend (Node.js + MySQL) | `server/` directory — Express setup, all routes, controllers, middleware, MySQL schema (`schema.sql`), seed data, Razorpay and Cloudinary integration |
| **Member 3** | JavaScript (Interactions + Game) | All files in `client/js/` — `api.js`, `cart.js`, `auth.js`, `components.js`, every page JS file, and the full `game.js` BakeMaster engine. Also sets up Chart.js charts in `admin.js` |

> **Tip:** Member 1 can work fully independently — use hardcoded JS arrays in the HTML
> as placeholder data while Member 2 builds the API. Member 3 then replaces those arrays
> with real `apiFetch()` calls once the backend is ready.

---

## 9. Figma Design Checklist (Mid-Term)

Design both **mobile (375px)** and **desktop (1280px)** frames for each page.

| Page | Key elements to include | Done |
|---|---|---|
| Registration / Login | Tab switcher, all form fields, validation error states, CTA button | ☐ |
| Homepage / Landing | Navbar, Hero, Category pills, 4 product cards, Promo banner, Game CTA, Footer | ☐ |
| Product Catalogue & Search | Sidebar filters, search bar, sort dropdown, product card grid, skeleton state | ☐ |
| Feedback / Contact Us | Contact info card, feedback form, star rating widget, success state, FAQ accordion | ☐ |

---

## 10. PPT Slide Outline (Mid-Term)

> Maximum **10 slides**. Visual-heavy, text-light.
> Use BakeEase warm colour scheme (`#B05E2D`) in the PPT template.

| # | Slide Title | Content |
|---|---|---|
| 1 | Title Slide | Project name, team names, course name, date |
| 2 | Problem Statement | Pain points of Mumbai bakeries; why digital ordering matters |
| 3 | SDG Context | SDG 8 – Decent Work & Economic Growth; how BakeEase supports small business digitisation |
| 4 | Objectives | 5–6 bullet project goals |
| 5 | UI Design — Login / Register | Figma screenshots (desktop + mobile) |
| 6 | UI Design — Homepage | Figma screenshots |
| 7 | UI Design — Catalogue + Contact | Figma screenshots side by side |
| 8 | Database Schema | ERD from MySQL Workbench or table-relationship summary |
| 9 | Tech Stack | Diagram: HTML/CSS/JS → `fetch()` → Node.js/Express → MySQL |
| 10 | Future Scope / Conclusion | Full feature list, BakeMaster game, SDG impact |

---

*BakeEase — Web Programming Lab Mini Project | SDG 8 | March 2026*
