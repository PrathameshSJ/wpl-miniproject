# 🎨 BakeEase — Design Document

> **Project:** BakeEase — Online Bakery Ordering & Delivery Platform
> **Team:** Team of 3 | Web Programming Lab | March 2026

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Visual Identity](#2-visual-identity)
3. [Page-by-Page Specification](#3-page-by-page-specification)
4. [BakeMaster Mini-Game UI](#4-bakemaster-mini-game-ui)
5. [Database Schema](#5-database-schema)

---

## 1. Design Philosophy

BakeEase uses a **warm, artisan bakery aesthetic** — cream backgrounds, warm browns, and soft terracotta accents. The design must feel inviting and appetising, like stepping into a boutique bakery, while remaining clean and highly usable on mobile.

### 1.1 Design Principles

| Principle | Description |
|---|---|
| **Warmth First** | Every screen should feel comfortable, not clinical |
| **Mobile Native** | Design is built for 375px upwards; desktop is an enhancement |
| **Visual Hierarchy** | Product images are large and central; CTAs are unmissable |
| **Consistent Components** | Reusable React components with shared design tokens |
| **Accessible** | 4.5:1 contrast minimum on all text; keyboard-navigable |

---

## 2. Visual Identity

### 2.1 Colour Palette

| Role | Hex | Usage |
|---|---|---|
| Primary | `#B05E2D` | CTAs, active nav, headings, key UI elements |
| Primary Dark | `#6B3A2A` | Hover states, subheadings, borders |
| Accent | `#F4A261` | Highlights, badges, promo banners |
| Background | `#FDF6EC` | Global page background |
| Surface | `#FFFFFF` | Cards, modals, input fields |
| Text Primary | `#1A1A1A` | Body text |
| Text Secondary | `#666666` | Labels, captions, meta info |
| Success | `#2D9966` | Order confirmed, stock available |
| Error | `#CC3333` | Form errors, payment failure |

### 2.2 Typography

| Element | Font / Weight | Size |
|---|---|---|
| Brand / Logo | Playfair Display, Bold | 36px |
| Page Heading H1 | Playfair Display, SemiBold | 32px |
| Section Heading H2 | Inter, SemiBold | 22px |
| Body Text | Inter, Regular | 16px |
| Caption / Label | Inter, Regular | 13px |
| Button | Inter, SemiBold | 15px |

> **Google Fonts import:** `Playfair Display` + `Inter`

### 2.3 Spacing & Shapes

- **Base grid:** 8px
- **Padding scale:** 8 / 16 / 24 / 32 / 48px
- **Border radius:** Cards `12px` · Buttons `8px` · Pills `24px` · Modals `16px`

### 2.4 Iconography & Imagery

- **Icons:** [Lucide React](https://lucide.dev/) — consistent line style, 20–24px default
- **Product photos:** Square 1:1 ratio, warm-lit on white or wooden background
- **Illustrations:** Simple flat-style SVG for empty states and the game
- **Shadows:** `box-shadow: 0 2px 12px rgba(0,0,0,0.08)` on cards

---

## 3. Page-by-Page Specification

### 3.1 Registration / Login Page

**Layout:** Single centred card (max-width `440px`) on a warm background with a top bakery illustration banner.

#### Components

| Section | Details |
|---|---|
| Logo + brand name | Top of card, centred |
| Tab switcher | `Login` \| `Register` with animated underline indicator |
| Login fields | Email, Password + "Forgot password?" link |
| Register fields | Full Name, Email, Phone, Password, Confirm Password |
| CTA button | Full-width, `#B05E2D` background, white text |
| OAuth placeholder | Google sign-in button (visual only for lab) |
| Guest link | "Continue as Guest" at bottom of card |

#### Validation States

- Real-time inline validation on `blur` — red border + error message below field
- Password strength indicator bar (Weak / Medium / Strong) on register form
- Success toast notification on login/register

---

### 3.2 Homepage / Landing Page

**Layout:** Full-width stacked sections. Hero takes `100vh` on desktop, `70vh` on mobile.

#### Section Breakdown

| Section | Description |
|---|---|
| **Navbar** | Logo (left), nav links (centre), Cart icon + Login (right). Sticky. Hamburger on mobile. |
| **Hero Banner** | Full-width image with overlay. Headline, subheading, two CTAs: `Order Now` (primary) + `Build Your Cake` (outline) |
| **Category Quick-Links** | Horizontally scrollable row of category pills with emoji icons (Cakes 🎂, Cupcakes 🧁, Pastries 🥐, Bread 🍞, Custom ✨) |
| **Featured Products** | 2×2 grid on mobile, 4-column on desktop. Card: image, name, price, star rating, Add to Cart button |
| **Promo Banner** | Full-width strip with seasonal offer text and CTA |
| **Best Sellers** | Same card grid, filtered by sales count |
| **BakeMaster Game CTA** | Decorative card with game illustration, `Play Now` button, session high score |
| **Testimonials** | 3-card horizontal carousel — avatar, name, rating, quote |
| **Footer** | Logo, quick links, social icons, contact info, copyright |

---

### 3.3 Product Catalogue & Search Page

**Layout:** Two-column — left sidebar (filters, `280px` fixed) + right product grid (flexible width).

#### Left Sidebar — Filters

| Filter | Type |
|---|---|
| Category | Checkboxes: Cakes, Pastries, Cupcakes, Bread, Custom |
| Price Range | Slider: ₹0 – ₹2,000 |
| Occasion | Multi-select: Birthday, Wedding, Anniversary, Baby Shower, Casual |
| Flavour | Checkboxes: Chocolate, Vanilla, Red Velvet, Mango, Butterscotch |
| Rating | Toggle: 4★ and above only |
| Clear All | Button to reset all filters |

#### Top Bar

- Search input with magnifier icon — debounced real-time results
- Results count text — *"Showing 24 of 48 products"*
- Sort dropdown — Price Low–High · Price High–Low · Popularity · Newest
- View toggle — Grid / List

#### Product Grid

- **Desktop:** 3 columns · **Tablet:** 2 columns · **Mobile:** 1 column
- **Product card:** image, category badge, name, short description, price, star rating, Add to Cart button
- Lazy loading with skeleton placeholder cards
- Pagination (12 per page) OR infinite scroll

---

### 3.4 Feedback / Contact Us Page

**Layout:** Two-column on desktop (contact info left, form right). Single column on mobile.

#### Left — Contact Info Card

- Bakery name and address (Mumbai location)
- Phone number with `tel:` click-to-call link
- Email address
- Operating hours table
- Embedded Google Maps iframe (static placeholder for lab)

#### Right — Feedback Form

| Field | Type |
|---|---|
| Full Name | Text input |
| Email | Email input |
| Phone | Text input (optional) |
| Subject | Dropdown: Order Issue, Product Feedback, General Enquiry, Suggestion |
| Message | Textarea (min 3 rows) |
| Star Rating | 1–5 star clickable widget — "Rate your experience" |
| Attachment | Optional photo upload for order issues |
| Submit | Button with loading spinner state |

**Success state:** Replace form with a thank-you card + illustration on successful submission.

#### FAQ Accordion

5–6 collapsible FAQ items covering: delivery zones, delivery time, custom cake lead time, refund policy, allergen information.

---

## 4. BakeMaster Mini-Game UI

**Canvas size:** `800 × 500px` on desktop, scales down proportionally on mobile.  
**Background:** Dark parchment texture with warm lighting effect.

### 4.1 Screen Flow

```
Start Screen → Game Screen → Result Screen
                    ↑               ↓
                    └── Play Again ←┘
```

### 4.2 Screen Specifications

#### Start Screen
- BakeMaster logo (SVG illustration)
- Difficulty selector: Easy / Medium / Hard (pill toggle)
- `Start Baking!` button
- Session high score display

#### Game Screen

| Element | Position | Description |
|---|---|---|
| Order card | Top-left | Shows target cake: base, frosting, decorations required |
| Cake preview | Centre | Live canvas showing placed ingredients with animations |
| Timer | Top-right | Countdown bar (red when < 10s); hidden on Easy |
| Stars bar | Top-centre | 1–3 star progress indicator |
| Ingredient trays | Bottom | Scrollable row of clickable ingredient tiles |

**Ingredient Trays (3 rows):**

| Row | Contents |
|---|---|
| Bases | Vanilla sponge, Chocolate sponge, Red Velvet sponge |
| Frostings | Vanilla buttercream, Chocolate ganache, Strawberry whipped |
| Decorations | Candles 🕯️, Sprinkles 🌈, Strawberries 🍓, Macarons, Fondant flowers |

**Interaction feedback:**
- ✅ Correct choice → ingredient animates onto cake canvas with a bounce
- ❌ Wrong choice → red flash + shake animation on cake canvas + timer penalty

#### Result Screen
- Stars earned (1–3 ⭐) with animation
- Time taken display
- `Play Again` button (primary)
- `Back to Shop` button (secondary/outline)

---

## 5. Database Schema

> Schema is designed in **3rd Normal Form (3NF)**. All monetary values stored in **INR (₹)**.

### Entity Relationship Summary

```
Users ──< Orders ──< Order_Items >── Products >── Categories
                         │
Orders ──── Payments
Users  ──< Reviews >── Products
Coupons (standalone, applied at checkout)
Inventory (standalone, managed by admin)
```

---

### Table: `users`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | INT | PK, AUTO_INCREMENT | Unique user identifier |
| `full_name` | VARCHAR(100) | NOT NULL | Customer or admin full name |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Login email address |
| `phone` | VARCHAR(15) | NOT NULL | Indian mobile number |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| `role` | ENUM | DEFAULT `'customer'` | `'customer'` or `'admin'` |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |

---

### Table: `categories`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `category_id` | INT | PK, AUTO_INCREMENT | Unique category ID |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Category name (Cakes, Pastries, etc.) |
| `icon_url` | VARCHAR(255) | — | Category emoji/icon path |

---

### Table: `products`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `product_id` | INT | PK, AUTO_INCREMENT | Unique product identifier |
| `category_id` | INT | FK → `categories` | Category reference |
| `name` | VARCHAR(150) | NOT NULL | Product name |
| `description` | TEXT | — | Full product description |
| `base_price` | DECIMAL(10,2) | NOT NULL | Base price in INR |
| `image_url` | VARCHAR(255) | — | Product image path/CDN URL |
| `is_available` | BOOLEAN | DEFAULT TRUE | Toggle product visibility |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Listing creation time |

---

### Table: `orders`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `order_id` | INT | PK, AUTO_INCREMENT | Unique order identifier |
| `user_id` | INT | FK → `users` | Ordering customer |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Total order value in INR |
| `status` | ENUM | NOT NULL | `pending` / `baking` / `out_for_delivery` / `completed` / `cancelled` |
| `delivery_type` | ENUM | NOT NULL | `'delivery'` or `'pickup'` |
| `delivery_address` | TEXT | — | Full delivery address |
| `scheduled_at` | DATETIME | — | Requested delivery date/time |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Order placed time |

---

### Table: `order_items`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `item_id` | INT | PK, AUTO_INCREMENT | Unique line item ID |
| `order_id` | INT | FK → `orders` | Parent order reference |
| `product_id` | INT | FK → `products` | Product ordered |
| `quantity` | INT | NOT NULL | Quantity ordered |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Price at time of order (snapshot) |
| `customisation` | JSON | — | Custom cake options — size, flavour, message, etc. |

---

### Table: `payments`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `payment_id` | INT | PK, AUTO_INCREMENT | Unique payment record |
| `order_id` | INT | FK → `orders` | Associated order |
| `method` | ENUM | NOT NULL | `'upi'` or `'cod'` |
| `status` | ENUM | NOT NULL | `'pending'` / `'success'` / `'failed'` / `'refunded'` |
| `transaction_id` | VARCHAR(100) | UNIQUE | Razorpay transaction reference |
| `paid_at` | TIMESTAMP | — | Payment completion time |

---

### Table: `reviews`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `review_id` | INT | PK, AUTO_INCREMENT | Unique review ID |
| `user_id` | INT | FK → `users` | Reviewer |
| `product_id` | INT | FK → `products` | Reviewed product |
| `rating` | TINYINT | 1–5 | Star rating |
| `comment` | TEXT | — | Review text |
| `is_approved` | BOOLEAN | DEFAULT FALSE | Admin moderation flag |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Review submission time |

---

### Table: `coupons`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `coupon_id` | INT | PK, AUTO_INCREMENT | Unique coupon ID |
| `code` | VARCHAR(30) | UNIQUE, NOT NULL | Coupon code string e.g. `BAKE20` |
| `discount_pct` | DECIMAL(5,2) | — | Percentage discount e.g. `20.00` |
| `min_order_value` | DECIMAL(10,2) | — | Minimum cart value to apply |
| `valid_until` | DATE | — | Coupon expiry date |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active/disabled flag |

---

### Table: `inventory`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `ingredient_id` | INT | PK, AUTO_INCREMENT | Unique ingredient ID |
| `name` | VARCHAR(100) | NOT NULL | Ingredient name e.g. `Flour` |
| `quantity_kg` | DECIMAL(8,2) | NOT NULL | Stock in kg or litres |
| `low_stock_threshold` | DECIMAL(8,2) | — | Alert threshold value |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last updated time |

---

### Relationships Summary

| Relationship | Type | Description |
|---|---|---|
| `users` → `orders` | 1 : Many | One customer can place many orders |
| `orders` → `order_items` | 1 : Many | One order contains many line items |
| `order_items` → `products` | Many : 1 | Each line item references one product |
| `products` → `categories` | Many : 1 | Many products belong to one category |
| `orders` → `payments` | 1 : 1 | Each order has one payment record |
| `users` → `reviews` | 1 : Many | A customer can leave many reviews |
| `reviews` → `products` | Many : 1 | Many reviews belong to one product |

---

*BakeEase — Web Programming Lab Mini Project | SDG 8 | March 2026*
