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

---

## Phase 0 — Setup & Planning
> **Timeline: Week 1** | Before any design or code begins

### Repository & Tools
- [✅] Create GitHub organisation / repo (`bakeease`)
- [✅] Add `README.md`, `PRD.md`, `DESIGN.md`, `TECH_STACK.md` to root
- [✅] Set up branching strategy (`main` → `dev` → `feature/*`)
- [✅] Add `.gitignore` (node_modules, .env, dist)
- [✅] Create `client/` and `server/` folders in repo

### Team Setup
- [✅] Assign roles (Member 1 = Frontend Core, Member 2 = Backend, Member 3 = Frontend Features + Game)
- [ ] Share Figma project file with all team members (editor access)
- [ ] Create shared colour styles and text styles in Figma
- [✅] Set up WhatsApp/Discord group for team communication

### Local Dev Environment
- [ ] All members have Node.js 20 LTS installed (`node -v` to verify)
- [ ] All members have MySQL Workbench installed
- [ ] All members have VS Code with ESLint + Prettier + Tailwind IntelliSense
- [ ] Vite + React project scaffolded (`npm create vite@latest`)
- [ ] TailwindCSS configured in the Vite project
- [ ] Express server scaffolded with basic `app.js`
- [ ] `.env.example` files created for both `client/` and `server/`

---

## Phase 1 — Figma Design (Mid-Term)
> **Timeline: Weeks 1–2** | All 4 required pages, both mobile and desktop frames

### Design System (Do this FIRST before any pages)
- [ ] Colour styles defined (Primary `#B05E2D`, Accent `#F4A261`, Background `#FDF6EC`, etc.)
- [ ] Text styles defined (Playfair Display headings, Inter body)
- [ ] Spacing tokens set up (8px grid)
- [ ] Button component created (Primary, Secondary/Outline, Ghost)
- [ ] Input field component created (default, focus, error states)
- [ ] Card component created (Product card with image, name, price, rating)
- [ ] Navbar component created (desktop + mobile hamburger variant)
- [ ] Footer component created

### Page 1 — Registration / Login
- [ ] Desktop frame (1280px wide)
- [ ] Mobile frame (375px wide)
- [ ] Login tab — fields, CTA, "Forgot password?" link
- [ ] Register tab — all 5 fields, password strength bar
- [ ] Form validation error states shown
- [ ] Google OAuth button (visual placeholder)
- [ ] Tab switch animation shown in prototype

### Page 2 — Homepage / Landing
- [ ] Desktop frame (1280px wide)
- [ ] Mobile frame (375px wide)
- [ ] Sticky Navbar (with cart icon, login button)
- [ ] Hero section (full-width, headline, two CTAs)
- [ ] Category quick-link pills (horizontal scroll)
- [ ] Featured Products grid (4 cards desktop, 2 mobile)
- [ ] Promo / seasonal offer banner
- [ ] Best Sellers section
- [ ] BakeMaster Game CTA card
- [ ] Customer testimonials carousel (3 cards)
- [ ] Footer

### Page 3 — Product Catalogue & Search
- [ ] Desktop frame (1280px wide)
- [ ] Mobile frame (375px wide)
- [ ] Left sidebar with all filters (category, price slider, occasion, flavour, rating)
- [ ] Search bar with debounced results state
- [ ] Sort dropdown
- [ ] Grid view with product cards (3 col desktop, 2 col mobile)
- [ ] Skeleton loading placeholder state shown
- [ ] Empty state (no results found) shown

### Page 4 — Feedback / Contact Us
- [ ] Desktop frame (1280px wide)
- [ ] Mobile frame (375px wide)
- [ ] Left: contact info card with address, phone, hours, map placeholder
- [ ] Right: full feedback form
- [ ] Star rating widget (clickable, 1–5)
- [ ] File attachment input
- [ ] Form success/thank-you state
- [ ] FAQ accordion (5+ items, open + closed states)

### Figma Prototype
- [ ] Login → Homepage flow linked
- [ ] Homepage → Catalogue flow linked
- [ ] Navbar links working in prototype
- [ ] Mobile hamburger menu opens/closes in prototype
- [ ] Export frames as PNG for PPT slides

---

## Phase 2 — Database & Backend Foundation
> **Timeline: Weeks 2–3** | Member 2 leads; others review schema

### Database Schema (MySQL)
- [ ] `users` table created
- [ ] `categories` table created
- [ ] `products` table created
- [ ] `orders` table created
- [ ] `order_items` table created
- [ ] `payments` table created
- [ ] `reviews` table created
- [ ] `coupons` table created
- [ ] `inventory` table created
- [ ] All foreign key constraints verified
- [ ] Seed data added (5+ categories, 20+ products)

### Backend Boilerplate
- [ ] Express app set up with CORS, JSON parsing
- [ ] MySQL connection pool configured (`config/db.js`)
- [ ] `.env` variables loaded via dotenv
- [ ] Global error handler middleware (`middleware/errorHandler.js`)
- [ ] Server runs on `localhost:5000` without errors

### Auth API
- [ ] `POST /api/auth/register` — creates user, hashes password
- [ ] `POST /api/auth/login` — validates credentials, returns JWT
- [ ] `authMiddleware.js` — verifies JWT on protected routes
- [ ] `adminMiddleware.js` — checks `role === 'admin'`
- [ ] Tested in Postman ✓

### Products API
- [ ] `GET /api/products` — returns all with category/search/sort/page filters
- [ ] `GET /api/products/:id` — returns single product
- [ ] `POST /api/products` — admin: create product (with Cloudinary image upload)
- [ ] `PUT /api/products/:id` — admin: update product
- [ ] `DELETE /api/products/:id` — admin: delete product
- [ ] `GET /api/categories` — returns all categories
- [ ] Tested in Postman ✓

### Orders & Payments API
- [ ] `POST /api/orders` — create order + order_items in transaction
- [ ] `GET /api/orders/my` — customer's own orders
- [ ] `GET /api/orders` — admin: all orders with filters
- [ ] `PATCH /api/orders/:id/status` — admin: update status
- [ ] `POST /api/payments/create` — Razorpay order creation
- [ ] `POST /api/payments/verify` — HMAC-SHA256 signature check
- [ ] COD flow tested (no Razorpay call) ✓
- [ ] UPI flow tested with Razorpay test keys ✓

### Supporting APIs
- [ ] `POST /api/reviews` — submit review
- [ ] `GET /api/reviews/:productId` — get approved reviews
- [ ] `POST /api/contact` — save feedback form submission
- [ ] `POST /api/coupons/apply` — validate and return discount value

---

## Phase 3 — Frontend Core Pages
> **Timeline: Weeks 3–4** | Member 1 leads; matches Figma designs exactly

### Shared Components
- [ ] `Navbar.jsx` — sticky, responsive with hamburger menu
- [ ] `Footer.jsx`
- [ ] `ProductCard.jsx` — image, name, price, rating, Add to Cart
- [ ] `StarRating.jsx` — display and interactive variants
- [ ] `Button.jsx` — Primary, Outline, Ghost variants
- [ ] `Input.jsx` — with label, error state, helper text
- [ ] `Toast` notifications (via react-hot-toast)
- [ ] `LoadingSkeleton.jsx` for product grid
- [ ] `ProtectedRoute.jsx` — redirects unauthenticated users

### Auth Pages
- [ ] `Login.jsx` — email/password form, JWT stored on success
- [ ] `Register.jsx` — full registration form with validation (Zod + React Hook Form)
- [ ] Password strength indicator component
- [ ] `ForgotPassword.jsx` (basic, can be non-functional for mid-term)
- [ ] Auth state managed in Zustand `authStore.js`

### Homepage
- [ ] Hero banner with CTAs
- [ ] Category quick-links (scrollable pills)
- [ ] Featured Products section (data fetched from API)
- [ ] Promo banner
- [ ] Best Sellers section
- [ ] BakeMaster game CTA card with `Play` button
- [ ] Testimonials carousel

### Product Catalogue Page
- [ ] Sidebar filters connected to API query params
- [ ] Search bar with debounce (300ms)
- [ ] Sort dropdown connected
- [ ] Product grid with lazy loading + skeleton
- [ ] Pagination or infinite scroll

### Product Detail Page
- [ ] Image gallery
- [ ] Size/flavour option selectors
- [ ] Add-on checkboxes (candles, message card)
- [ ] Quantity selector
- [ ] Add to Cart button
- [ ] Reviews section (stars + comments)

### Contact / Feedback Page
- [ ] Contact info card
- [ ] Feedback form (React Hook Form + Zod validation)
- [ ] Star rating widget (interactive)
- [ ] File attachment input
- [ ] Success state on submit
- [ ] FAQ accordion

---

## Phase 4 — Frontend Features & Game
> **Timeline: Weeks 4–5** | Member 3 leads

### Cart & Checkout
- [ ] Cart drawer/page — list items, quantities, subtotal
- [ ] Update quantity / remove item
- [ ] Coupon code input + apply
- [ ] Checkout page — delivery vs pickup toggle
- [ ] Address form
- [ ] Date/time picker for scheduled delivery
- [ ] Payment method selector (UPI or COD)
- [ ] Order summary panel
- [ ] Razorpay modal opens for UPI
- [ ] COD confirms directly
- [ ] Order confirmation page

### User Dashboard
- [ ] Order history list
- [ ] Live order status tracker (4-step progress bar)
- [ ] Profile edit form
- [ ] Saved addresses manager

### Admin Panel
- [ ] Admin-only route guard
- [ ] Products management table (CRUD)
- [ ] Image upload in product form
- [ ] Orders table with status filter and date filter
- [ ] Update order status dropdown
- [ ] Inventory stock table
- [ ] Low-stock alert indicators
- [ ] Sales dashboard — Recharts bar chart (daily revenue) + line chart (monthly trend)
- [ ] Best-selling products list

### BakeMaster Mini-Game
- [ ] Start screen — difficulty selector, high score display
- [ ] Customer order card component (randomised orders)
- [ ] Cake preview canvas (layered SVG)
- [ ] Ingredient tray component (Base row, Frosting row, Decoration row)
- [ ] Click-to-place ingredient with bounce animation
- [ ] Wrong choice → shake animation + timer penalty
- [ ] Timer component (hidden on Easy mode)
- [ ] Star scoring logic (3 stars = fast, 2 = medium, 1 = slow/one-wrong)
- [ ] Result screen — stars display, Play Again, Back to Shop
- [ ] High score saved to `localStorage`
- [ ] Game accessible from Navbar and Homepage CTA

---

## Phase 5 — Integration, Polish & Testing
> **Timeline: Week 5–6** | All members

### Integration
- [ ] All frontend pages connected to live backend API (not mock data)
- [ ] Axios base URL set via `VITE_API_URL` env variable
- [ ] JWT interceptor in Axios — auto-attaches token to requests
- [ ] 401 response → auto logout + redirect to login

### Responsive QA
- [ ] Tested at 375px (iPhone SE)
- [ ] Tested at 768px (iPad)
- [ ] Tested at 1280px (Desktop)
- [ ] Tested on Chrome, Firefox, Edge

### UX Polish (Theobroma-inspired fixes)
- [ ] Prices visible on ALL product cards (no hidden pricing)
- [ ] Veg/non-veg indicator dot on every product card
- [ ] Active nav link highlighted on current page
- [ ] CTA buttons have sufficient colour contrast (4.5:1 minimum)
- [ ] Carousel arrows clearly visible (use overlay shadow if needed)
- [ ] Add to Cart available from grid — no forced redirect to detail page
- [ ] Search results load in < 500ms
- [ ] Loading states (skeletons/spinners) on all async operations
- [ ] Empty states for: empty cart, no results, no orders yet

### Security Checklist
- [ ] All admin routes return 403 for non-admin JWT
- [ ] Passwords never returned in API responses
- [ ] All inputs validated server-side (express-validator)
- [ ] `.env` is in `.gitignore` and NOT pushed to GitHub
- [ ] Razorpay payment signature verified server-side (never trust client)

---

## Phase 6 — Mid-Term Submission Package
> **Deadline: As per lab schedule**

### Figma
- [ ] All 4 pages complete in Figma (desktop + mobile frames)
- [ ] Prototype flow works (Login → Home → Catalogue)
- [ ] Figma share link set to "Anyone with link can view"

### PPT (max 10 slides)
- [ ] Slide 1: Title — project name, team names, course, date
- [ ] Slide 2: Problem Statement — local bakery pain points
- [ ] Slide 3: SDG 8 context — how BakeEase supports small business digitisation
- [ ] Slide 4: Objectives — 5–6 bullet goals
- [ ] Slide 5: UI Design — Registration/Login screenshots
- [ ] Slide 6: UI Design — Homepage screenshots
- [ ] Slide 7: UI Design — Catalogue + Contact screenshots
- [ ] Slide 8: Database Schema — ER diagram or table summary
- [ ] Slide 9: Tech Stack — architecture diagram (React → Express → MySQL)
- [ ] Slide 10: Future Scope / Conclusion

### Code Submission (if required)
- [ ] GitHub repo link shared with professor
- [ ] `README.md` up to date with setup instructions
- [ ] Database schema `.sql` file committed to repo (`/server/schema.sql`)
- [ ] Figma link added to `README.md`

---

## Full Project — Post Mid-Term
> **Timeline: Weeks 6–8** | Remaining features for final submission

- [ ] Custom Cake Builder (size, flavour, frosting, theme, message, image upload, live price)
- [ ] UPI Razorpay payment end-to-end in production/test
- [ ] Email confirmations (Nodemailer) on order placed
- [ ] SMS notifications (optional — Twilio or MSG91)
- [ ] Admin review moderation
- [ ] Coupon code management in admin panel
- [ ] Delivery zone setup and delivery fee calculation
- [ ] Estimated delivery time display at checkout
- [ ] Subscription orders (weekly bread — optional stretch goal)
- [ ] Loyalty points system (optional stretch goal)
- [ ] Accessibility audit (WAVE or axe DevTools)
- [ ] Performance audit (Lighthouse score ≥ 90)
- [ ] Final deployment (Vercel for frontend, Railway/Render for backend)

---

*BakeEase — Web Programming Lab Mini Project | SDG 8 | March 2026*
