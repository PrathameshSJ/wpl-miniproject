# ✅ BakeEase — Project Checklist

> Track every feature across all phases. Check off items as you complete them.
> **Team of 3 | Web Programming Lab | March 2026**

---

## Legend

| Symbol | Meaning |
|---|---|
| ☐ | Not started |
| 🔄 | In progress |
| ✅ | Done |
| 🔴 | Blocked / needs attention |
## 📅 Phase Overview

| Phase | Focus | Deadline Target |
|---|---|---|
| [Phase 1](#-phase-1--setup--planning) | Setup & Planning | Week 1 |
| [Phase 2](#-phase-2--figma-design-mid-term) | Figma Design (Mid-Term Submission) | Week 2–3 |
| [Phase 3](#phase-3--frontend-core-pages) | Frontend Core Pages (HTML/CSS/JS) | Week 3–4 |
| [Phase 4](#-phase-4--backend--database) | Backend & Database | Week 4–6 |
| [Phase 5](#-phase-5--full-features--integration) | Full Features & Integration | Week 7–9 |
| [Phase 6](#-phase-6--mini-game--extras) | Mini-Game & Extras | Week 9–10 |
| [Phase 7](#-phase-7--testing--final-polish) | Testing & Final Polish | Week 11–12 |

---

## 🟦 Phase 1 — Setup & Planning

> **Goal:** Get the project foundation in place before writing any UI or backend code.

### Repository & Tools
- [✅] Create GitHub repository (`bakeease`)
- [✅] Add `README.md`, `PRD.md`, `DESIGN.md`, `TECH_STACK.md`, `CHECKLIST.md`
- [✅] Set up `.gitignore` (ignore `node_modules/`, `.env`)
- [ ] Create branches: `main`, `dev`, `feature/frontend-core`, `feature/backend`, `feature/game`
- [ ] All 3 team members clone the repo and confirm access

### Project Scaffold
- [] Create `client/` folder with subfolders: `styles/`, `js/`, `assets/images/`, `components/`, `admin/`
- [ ] Create `styles/variables.css` with all CSS custom properties (colours, spacing, fonts)
- [ ] Create `styles/base.css` (CSS reset + typography defaults) and `styles/components.css` (buttons, cards, inputs)
- [ ] Create `js/api.js` with `apiFetch()` wrapper, `js/cart.js`, and `js/components.js`
- [ ] Create `components/navbar.html` and `components/footer.html`
- [ ] Create blank `.html` files: `index.html`, `catalogue.html`, `login.html`, `contact.html`, `product.html`, `checkout.html`, `dashboard.html`, `game.html`, `admin/index.html`
- [ ] Add standard `<head>` template (Google Fonts CDN, Font Awesome CDN, CSS links) to every HTML file
- [ ] Scaffold backend: `mkdir server && cd server && npm init -y`
- [ ] Install backend deps: `npm install express mysql2 jsonwebtoken bcryptjs dotenv cors multer cloudinary express-validator razorpay`
- [ ] Install dev dep: `npm install --save-dev nodemon`
- [ ] Set up `server/.env.example` with blank values
- [ ] Create `server/` folder structure as per `TECH_STACK.md`

### Database
- [ ] Install XAMPP → start MySQL → open phpMyAdmin
- [ ] Create database `bakeease_db` in phpMyAdmin
- [ ] Create database: `CREATE DATABASE bakeease_db;`
- [ ] Write `schema.sql` with all 9 table definitions
- [ ] Run schema and confirm all tables are created
- [ ] Add at least 10 seed products across 5 categories
- [ ] Add 1 admin user and 2 customer users as seed data

---

## 🟨 Phase 2 — Figma Design (Mid-Term)

> **Goal:** Complete all 4 required Figma pages for the mid-term evaluation. Design both mobile (375px) and desktop (1280px) frames for each page.

### Figma Setup
- [ ] Create a Figma project: `BakeEase`
- [ ] Set up a dedicated **Design System** page (colours, typography, components)
- [ ] Define colour styles: `Primary #B05E2D`, `Primary Dark #6B3A2A`, `Accent #F4A261`, `Background #FDF6EC`, `Surface #FFFFFF`, `Text Primary #1A1A1A`, `Text Secondary #666666`, `Success #2D9966`, `Error #CC3333`
- [ ] Define text styles: `H1 Playfair 32px Bold`, `H2 Inter 22px SemiBold`, `Body Inter 16px Regular`, `Caption Inter 13px Regular`, `Button Inter 15px SemiBold`
- [ ] Build reusable components: `Button (primary/outline/text)`, `Input field (default/focus/error)`, `Product Card`, `Navbar`, `Footer`, `Star Rating`, `Badge/Pill`, `Category Pill`

### Page 1 — Registration / Login
- [ ] Desktop frame (1280×900px)
  - [ ] Warm background (`#FDF6EC`) with bakery illustration banner at top
  - [ ] Centred card (max-width 440px), white background, `border-radius 12px`, subtle shadow
  - [ ] Logo + brand name at top of card
  - [ ] Tab switcher: **Login** | **Register** (active tab has brown underline)
  - [ ] Login form: Email field, Password field, "Forgot password?" link right-aligned
  - [ ] Register form: Full Name, Email, Phone, Password, Confirm Password
  - [ ] Password strength bar (3 segments: Weak red / Medium yellow / Strong green)
  - [ ] Full-width CTA button (`#B05E2D`, white text, `border-radius 8px`)
  - [ ] Google sign-in placeholder button (outline style)
  - [ ] "Continue as Guest" link below button
  - [ ] Show validation error state on at least one field (red border + error message)
- [ ] Mobile frame (375×812px)
  - [ ] Card stretches full width with 16px horizontal padding
  - [ ] Same all elements, adjusted spacing

### Page 2 — Homepage / Landing
- [ ] Desktop frame (1280×5000px — tall enough for all sections)
  - [ ] **Navbar:** logo (left), links: Home / Menu / Custom Cake / Game / Contact (centre), cart icon + Login button (right); height 64px; white background; bottom border `#E8C4A0`
  - [ ] **Hero:** full-width image (use a placeholder), dark overlay, white headline (`Playfair Display 52px`), subheading, two CTAs: `Order Now` (filled brown) + `Build Your Cake` (white outline)
  - [ ] **Category Pills:** 5 pills in a horizontal row — 🎂 Cakes, 🧁 Cupcakes, 🥐 Pastries, 🍞 Bread, ✨ Custom — rounded full, brown background active state
  - [ ] **Featured Products:** section heading, 4-column product card grid (4 cards minimum)
  - [ ] **Promo Banner:** full-width strip in `#F4A261`, bold offer text, CTA button
  - [ ] **Best Sellers:** section heading, 4-column grid
  - [ ] **BakeMaster CTA Card:** parchment-toned background, game illustration area, `Play Now` button, "High Score: 0" text
  - [ ] **Testimonials:** section heading, 3 cards side by side (avatar circle, name, 5 stars, quote text)
  - [ ] **Footer:** dark brown `#3B1F14` background, white text, 4-column layout (logo+tagline / Quick Links / Contact / Social Icons), copyright bar at bottom
- [ ] Mobile frame (375×4000px)
  - [ ] Hamburger menu icon replaces nav links
  - [ ] Hero 70vh
  - [ ] Category pills horizontally scrollable (no wrapping)
  - [ ] Products in 2-column grid
  - [ ] Footer stacked into single column

### Page 3 — Product Catalogue & Search
- [ ] Desktop frame (1280×2000px)
  - [ ] **Sticky Navbar** (same as homepage)
  - [ ] Page heading: "Our Menu"
  - [ ] **Left sidebar** (280px wide):
    - [ ] "Filters" heading with Clear All link
    - [ ] Category checkboxes (5 items)
    - [ ] Price range slider (₹0–₹2000) with min/max labels
    - [ ] Occasion multi-select (5 items)
    - [ ] Flavour checkboxes (5 items)
    - [ ] Rating toggle (4★ and above)
  - [ ] **Top bar:** search input (full width of content area), results count text, sort dropdown, grid/list toggle icons
  - [ ] **Product grid:** 3-column, at least 6 product cards
  - [ ] **Skeleton loading card:** grey shimmer placeholder (show 1)
  - [ ] **Empty state** (optional): illustration + "No products found" text
- [ ] Mobile frame (375×2500px)
  - [ ] "Filters" button opens a bottom drawer (show the drawer open as a second frame)
  - [ ] Search bar full width
  - [ ] Products in 2-column grid

### Page 4 — Feedback / Contact Us
- [ ] Desktop frame (1280×1600px)
  - [ ] Page heading: "Get in Touch"
  - [ ] **Left column — Contact Info Card:**
    - [ ] Bakery name, address in Mumbai
    - [ ] Phone number with phone icon
    - [ ] Email with mail icon
    - [ ] Operating hours table (Mon–Sun)
    - [ ] Placeholder rectangle for Google Maps embed
  - [ ] **Right column — Feedback Form:**
    - [ ] Full Name input
    - [ ] Email input
    - [ ] Phone input (optional label)
    - [ ] Subject dropdown
    - [ ] Message textarea (3 rows)
    - [ ] Star rating widget: "Rate your experience" label + 5 clickable stars (show 4 stars selected)
    - [ ] File attachment button
    - [ ] Submit button (full width of form)
    - [ ] Show success state as an alternate frame (thank-you card with illustration)
  - [ ] **FAQ Accordion** below form: 5 items, 1 shown open with answer visible
- [ ] Mobile frame (375×2800px)
  - [ ] Stacked: contact card on top, form below
  - [ ] FAQ full width below

### Figma Prototype Links
- [ ] Link all pages together (Navbar links connect to correct pages)
- [ ] Login CTA on Login page navigates to Homepage
- [ ] Category pills navigate to Catalogue page
- [ ] Contact link navigates to Feedback page
- [ ] Share prototype link — add it to `README.md`

### Presentation (PPT)
- [ ] Slide 1 — Title (project name, team, course, date)
- [ ] Slide 2 — Problem Statement
- [ ] Slide 3 — SDG 8 Context
- [ ] Slide 4 — Objectives (5–6 bullets)
- [ ] Slide 5 — UI: Registration / Login (Figma screenshot)
- [ ] Slide 6 — UI: Homepage (Figma screenshot)
- [ ] Slide 7 — UI: Catalogue & Contact Us (side by side)
- [ ] Slide 8 — Database Schema (ER diagram or table summary)
- [ ] Slide 9 — Tech Stack (architecture diagram)
- [ ] Slide 10 — Future Scope / Conclusion
- [ ] All slides use BakeEase `#B05E2D` brown colour scheme

---

## Phase 3 — Frontend Core Pages
> **Timeline: Weeks 3–4** | Member 1 writes HTML/CSS; Member 3 wires up JS

### Shared CSS (`styles/`)
- [ ] `variables.css` — all CSS custom properties finalised and shared with team
- [ ] `base.css` — CSS reset, `body` font/colour defaults, `a` tag styles, `img` defaults
- [ ] `components.css` — `.btn-primary`, `.btn-outline`, `.card`, `.input-field`, `.badge`, `.skeleton`, `.modal`, `.toast`
- [ ] `navbar.css` and `footer.css` with responsive hamburger menu

### Shared JS (`js/`)
- [ ] `js/api.js` — `apiFetch()` with JWT injection and 401 auto-logout
- [ ] `js/cart.js` — `getCart()`, `addToCart()`, `removeFromCart()`, `updateCartBadge()`
- [ ] `js/auth.js` — `login()`, `register()`, `logout()`, `isLoggedIn()`, `getUser()`
- [ ] `js/components.js` — `loadNavbar()`, `loadFooter()`, `highlightActiveNavLink()`, `showToast()`

### `components/navbar.html`
- [ ] Logo left, nav links centre, Cart icon + Login button right
- [ ] Cart badge counter showing item count
- [ ] Hamburger menu icon for mobile
- [ ] Mobile dropdown menu (CSS + JS toggle)
- [ ] Active link highlight via `highlightActiveNavLink()`

### Auth Page (`login.html` + `js/auth.js`)
- [ ] Tab switcher between Login and Register (CSS transition + JS class toggle)
- [ ] Login form — email + password, calls `POST /api/auth/login` via `apiFetch()`
- [ ] On success: store JWT + user in `localStorage`, redirect to `index.html`
- [ ] Register form — name, email, phone, password, confirm password
- [ ] Password strength bar (CSS width animation + JS logic — no library)
- [ ] Inline validation error messages shown below fields
- [ ] If already logged in, redirect away from this page

### Homepage (`index.html` + `js/home.js`)
- [ ] Hero section — headline, subheading, two CTA buttons
- [ ] Category pills row — `apiFetch('/categories')` to render dynamically
- [ ] Featured Products section — `apiFetch('/products?featured=true')` → render `.card` grid
- [ ] Promo banner strip
- [ ] Best Sellers section — separate API call with `?sort=popular`
- [ ] BakeMaster Game CTA card with link to `game.html`
- [ ] Testimonials — static HTML (3 hardcoded testimonial cards)
- [ ] Footer loaded via `loadFooter()`

### Product Catalogue Page (`catalogue.html` + `js/catalogue.js`)
- [ ] Sidebar filters — checkboxes, price range slider, occasion, flavour, rating toggle, Clear All
- [ ] Filters update URL query params and re-fetch products
- [ ] Search input — 300ms debounce using `setTimeout` and `clearTimeout`
- [ ] Sort dropdown — updates `?sort=` param and re-fetches
- [ ] Product grid — renders `.card` elements from API response
- [ ] Skeleton loading state shown while fetch is in progress
- [ ] Empty state shown when no results match filters

### Product Detail Page (`product.html` + `js/product.js`)
- [ ] Read `?id=` from URL: `new URLSearchParams(window.location.search).get('id')`
- [ ] Fetch `apiFetch('/products/' + id)` and render all fields
- [ ] Size and flavour selector buttons (toggle `.selected` class)
- [ ] Add-on checkboxes (candles, message card)
- [ ] Quantity +/- buttons
- [ ] Add to Cart button calls `addToCart()` from `cart.js`
- [ ] Reviews section — fetch and render approved reviews with stars

### Contact Page (`contact.html` + `js/contact.js`)
- [ ] Contact info card — address, phone (tel: link), email, hours table, map placeholder
- [ ] Feedback form — all fields, validate on submit, `POST /api/contact`
- [ ] Star rating widget — 5 clickable ★ icons, JS toggles `.selected` class
- [ ] File input for photo attachment
- [ ] Replace form with success card on successful submit
- [ ] FAQ accordion — `<details>` / `<summary>` HTML or JS toggle class approach

---

## Phase 4 — Frontend Features & Game
> **Timeline: Weeks 4–5** | Member 3 leads

### Cart & Checkout (`checkout.html` + `js/checkout.js`)
- [ ] Cart page section — read from `localStorage`, render items with qty +/- and remove button
- [ ] Subtotal calculation updates live as quantities change
- [ ] Coupon code input — calls `POST /api/coupons/apply`, shows discount if valid
- [ ] Checkout form — delivery vs pickup radio toggle, address fields, date/time picker
- [ ] Payment method selector — UPI or COD radio buttons
- [ ] Order summary panel (sticky on desktop)
- [ ] COD: `POST /api/orders` directly, redirect to `dashboard.html`
- [ ] UPI: Load Razorpay modal from CDN script, handle `handler()` callback, call verify endpoint
- [ ] Order confirmation — redirect with `?success=true`, show confirmation message

### User Dashboard (`dashboard.html` + `js/dashboard.js`)
- [ ] Page guard at top of script — redirect to `login.html` if no token
- [ ] Order history — `apiFetch('/orders/my')`, render list of order cards
- [ ] Each order card shows: order ID, date, total, status badge, items summary
- [ ] 4-step status progress bar: Pending → Baking → Out for Delivery → Completed
- [ ] Profile edit form — pre-fill from `localStorage` user, `PUT /api/users/me`
- [ ] Saved addresses list

### Admin Panel (`admin/*.html` + `js/admin.js`)
- [ ] Admin page guard — check `user.role === 'admin'` from `localStorage`
- [ ] `admin/index.html` — Sales dashboard with Chart.js bar chart (daily revenue) and line chart (monthly trend)
- [ ] `admin/products.html` — Products table with Edit + Delete buttons per row
- [ ] Add product form — image upload `<input type="file">`, all fields, `POST /api/products`
- [ ] Edit product — prefill form from selected row, `PUT /api/products/:id`
- [ ] `admin/orders.html` — Orders table, status filter dropdown, date filter
- [ ] Status update — dropdown per row calls `PATCH /api/orders/:id/status`
- [ ] Inventory table — stock levels with red highlight on low-stock rows

### BakeMaster Mini-Game (`game.html` + `js/game.js`)
- [ ] Start screen — difficulty pill toggle (Easy / Medium / Hard), high score from `localStorage`, Start button
- [ ] Random order card generator — picks a random base + frosting + 1–3 decorations
- [ ] Cake preview area — layered `<div>` elements with CSS, ingredients stack visually
- [ ] Ingredient tray rows — Base row, Frosting row, Decoration row of clickable tiles
- [ ] Click handler — if correct ingredient: CSS bounce animation added, move to next slot
- [ ] Wrong ingredient — CSS shake animation on cake preview, deduct 5s from timer
- [ ] Timer — `setInterval` countdown, displayed as progress bar, hidden on Easy
- [ ] Star scoring — 3 stars if no mistakes and >50% time left, 2 stars with 1 mistake, 1 star otherwise
- [ ] Result screen — star display, time taken, `Play Again` resets game state, `Back to Shop` → `index.html`
- [ ] High score saved to `localStorage` and shown on start screen

---


