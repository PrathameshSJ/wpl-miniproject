# 🖌️ BakeEase — Figma Guide

> A complete step-by-step guide to designing BakeEase in Figma.
> Theobroma-inspired warm aesthetic with UX improvements.

---

## Table of Contents

1. [Setting Up Your Figma File](#1-setting-up-your-figma-file)
2. [Creating the Design System First](#2-creating-the-design-system-first)
3. [Page-by-Page Design Steps](#3-page-by-page-design-steps)
4. [Theobroma Inspiration — What to Borrow & What to Fix](#4-theobroma-inspiration--what-to-borrow--what-to-fix)
5. [Prototyping & Linking Screens](#5-prototyping--linking-screens)
6. [Exporting for PPT](#6-exporting-for-ppt)
7. [Figma Tips for Beginners](#7-figma-tips-for-beginners)

---

## 1. Setting Up Your Figma File

### Step 1 — Create the file

1. Go to [figma.com](https://figma.com) → **New Design File**
2. Rename it: `BakeEase — Web Design`
3. Click **+** to add pages. Create these pages in this order:

```
Page 1: 🎨 Design System
Page 2: 🏠 Homepage
Page 3: 🔐 Login / Register
Page 4: 🛍️ Catalogue & Search
Page 5: 📩 Feedback & Contact
Page 6: 🎮 BakeMaster Game (optional for mid-term)
```

### Step 2 — Set up frames (the "canvas" for each screen)

On each page, press `F` (Frame tool) and set these sizes:

| Frame Name | Width | Height | Use for |
|---|---|---|---|
| `Desktop` | 1280 | 900 (auto) | Full desktop layout |
| `Mobile` | 375 | 812 (auto) | iPhone view |

> **Tip:** Set height to **"Hug contents"** so the frame grows as you add content. Right-click frame → "Resize to fit".

### Step 3 — Share with your team

- Click **Share** (top right) → Set to **"Anyone with the link"** → **Can edit**
- Send the link to both teammates

---

## 2. Creating the Design System First

> ⚠️ Do this BEFORE designing any page. It saves hours later.
> All of this goes on the **"🎨 Design System"** page.

### Step 1 — Create Colour Styles

1. Draw a rectangle → Fill it with `#B05E2D`
2. In the right panel under **Fill**, click the **4-dot grid icon** → **"+"** → Name it `Primary`
3. Repeat for every colour:

| Style Name | Hex |
|---|---|
| `Primary` | `#B05E2D` |
| `Primary/Dark` | `#6B3A2A` |
| `Accent` | `#F4A261` |
| `Background` | `#FDF6EC` |
| `Surface` | `#FFFFFF` |
| `Text/Primary` | `#1A1A1A` |
| `Text/Secondary` | `#666666` |
| `Success` | `#2D9966` |
| `Error` | `#CC3333` |

Once saved, you apply these everywhere by clicking any element's fill and choosing from **"Libraries"**.

### Step 2 — Create Text Styles

1. Type some text → Select it
2. In the right panel under **Text**, click the **4-dot grid icon** → **"+"**
3. Create these styles:

| Style Name | Font | Weight | Size |
|---|---|---|---|
| `Heading/H1` | Playfair Display | SemiBold | 32 |
| `Heading/H2` | Inter | SemiBold | 22 |
| `Heading/H3` | Inter | SemiBold | 18 |
| `Body/Regular` | Inter | Regular | 16 |
| `Body/Small` | Inter | Regular | 14 |
| `Caption` | Inter | Regular | 13 |
| `Button` | Inter | SemiBold | 15 |
| `Brand/Logo` | Playfair Display | Bold | 36 |

> To add Google Fonts in Figma: They are built-in. Just type "Playfair Display" or "Inter" in the font picker.

### Step 3 — Build Core Components

Create these as **Figma Components** (so you reuse them everywhere):

Press `Ctrl+Alt+K` (Windows) or `Cmd+Option+K` (Mac) to make a component.

#### 🔘 Button Component

1. Draw a rectangle: `160 × 44px`, corner radius `8`, fill `Primary (#B05E2D)`
2. Add text inside: `"Order Now"`, style `Button`, colour `#FFFFFF`
3. Auto-layout: `Shift+A` → Padding: `12px top/bottom, 24px left/right`
4. Make component (`Cmd+Option+K`)
5. Create **variants** (right panel → "+"):
   - `Variant = Primary` → Brown fill, white text
   - `Variant = Outline` → White fill, brown border + brown text
   - `Variant = Ghost` → Transparent, brown text

#### 📦 Product Card Component

1. Draw a frame: `260 × 320px`, corner radius `12`, fill `#FFFFFF`
2. Add a rectangle at top: `260 × 180px`, fill with a warm placeholder colour `#F4A261` (this is where product image goes)
3. Add category badge: small pill `8px radius`, fill `#FDF6EC`, text `"Cake"` in `Caption` style
4. Add product name text: `Body/Regular`, bold, `#1A1A1A`
5. Add price text: `Heading/H3`, `Primary (#B05E2D)`
6. Add star icons (use ★ text or the Lucide icon plugin)
7. Add "Add to Cart" button at bottom
8. Select all → `Shift+A` (Auto Layout, vertical, 12px gap) → Make Component

#### 🔤 Input Field Component

1. Draw rectangle: `full width × 48px`, border `1.5px` solid `#CCCCCC`, radius `8`
2. Add label text above: `Caption`, `Text/Secondary`
3. Add placeholder text inside: `Body/Regular`, `Text/Secondary`
4. Make variants: `Default`, `Focus` (border turns `Primary`), `Error` (border turns `Error (#CC3333)`) + error message below

#### 🧭 Navbar Component

1. Create a frame: `1280 × 68px`, fill `#FFFFFF`, bottom border `1px` `#F0E6D3`
2. Left: BakeEase logo text in `Brand/Logo` style, colour `Primary`
3. Centre: Nav links — `Home`, `Menu`, `Custom Cake`, `Game`, `About` in `Body/Regular`
4. Right: Cart icon + badge, `Login` button (Outline variant)
5. Auto-layout horizontal, space-between
6. Make Component → Create a **Mobile variant** with a hamburger icon (☰) replacing the nav links

---

## 3. Page-by-Page Design Steps

### Page: Login / Register

#### Desktop (1280px frame)

1. Background: fill `Background (#FDF6EC)`
2. Centre a card frame: `440 × auto`, fill `Surface (#FFFFFF)`, corner radius `16`, shadow `0 4px 24px rgba(0,0,0,0.08)`
3. Inside the card (Auto Layout vertical, 20px gap, 40px padding):
   - Logo + "BakeEase" text
   - Tab switcher row: two text buttons `"Login"` and `"Register"`, with a `2px` bottom border on the active tab in `Primary` colour
   - **For Login tab:**
     - Email input field component
     - Password input field component
     - `"Forgot password?"` text link — right-aligned, `Caption`, `Primary`
     - Login button (Primary, full width)
     - Divider with `"or"` text
     - Google button (white background, Google logo, `"Continue with Google"`)
   - `"Continue as Guest"` link at bottom, centred
4. Background: optionally add a large soft bakery illustration or warm blob shape behind the card

#### Mobile (375px frame)

- Same card but `width: 100%`, `margin: 16px`
- Font sizes drop slightly — use your text styles, they'll auto-scale

---

### Page: Homepage

Build section by section. Each section is its own **Auto Layout frame** stacked vertically.

#### Navbar
- Use your Navbar component (already built)

#### Hero Section
1. Frame: `1280 × 560px`
2. Add a warm background colour `#6B3A2A` or a dark overlay rectangle
3. Large headline text: `"Fresh Baked, Just for You"` — `Heading/H1`, white, large (48px override)
4. Sub-text: `"Order custom cakes & pastries delivered to your door in Mumbai"` — `Body/Regular`, white/80% opacity
5. Two buttons side by side: `"Order Now"` (Primary) + `"Build Your Cake"` (Outline in white)
6. On the right side: a large product image (use a placeholder warm-coloured rectangle or [Unsplash food image](https://unsplash.com/s/photos/cake))

> 🍰 **Theobroma inspiration:** Their hero uses a large full-bleed product close-up. Do the same — big, appetising, warm-lit cake photo.

#### Category Pills Row
1. Horizontal auto-layout frame
2. Each pill: `"🎂 Cakes"`, `"🧁 Cupcakes"`, `"🥐 Pastries"`, `"🍞 Bread"`, `"✨ Custom"`
3. Pill style: `border-radius: 24px`, padding `10px 20px`, border `1.5px Primary`, text `Body/Small Primary`
4. Active pill: filled `Primary`, text white

#### Featured Products
1. Heading: `"Featured Products"` — `Heading/H2`
2. 4-column grid of your Product Card component
3. "View All" link — right aligned

#### Promo Banner
1. Full-width frame: `1280 × 120px`, fill `Accent (#F4A261)`
2. Left: `"🎉 20% off this Holi — Use code HOLI20"` in bold text
3. Right: `"Shop Now →"` button in Primary colour

#### BakeMaster Game CTA
1. Frame with a parchment/warm texture feel — fill `#F4E4C1`, border `2px dashed #B05E2D`, radius `16px`
2. Left: Game icon/illustration (draw a simple cake SVG or use an emoji 🎮)
3. Text: `"BakeMaster"` heading + `"Think you can fill orders faster than our bakers?"` subtext
4. `"Play Now"` button

#### Testimonials
1. 3 cards side by side, each with: avatar circle, name, `"⭐⭐⭐⭐⭐"` stars, short quote text
2. Card: white, radius `12px`, shadow

#### Footer
1. Dark background: `#1A1A1A`, full width
2. 4 columns: Logo+tagline | Quick links | Contact | Social icons
3. Bottom bar: `"© 2026 BakeEase"` — centred, small grey text

---

### Page: Product Catalogue & Search

1. Navbar at top (component)
2. Page title: `"Our Menu"` — `Heading/H1`
3. Two-column layout (use a horizontal auto-layout frame):

**Left sidebar (280px fixed width):**
- `"Filters"` heading
- Category section: label + 5 checkboxes (use a checkbox component)
- Price range: label + a slider shape (draw a track + thumb rectangle)
- Occasion: label + 5 checkboxes
- Flavour: label + 5 checkboxes
- Rating toggle: `"4★ and above"` with a toggle switch
- `"Clear All Filters"` text button — `Error (#CC3333)` colour

**Right content area (flexible width):**
- Top bar: search input + results count text + sort dropdown + grid/list view toggle icons
- Product grid: 3 columns of your Product Card component
- Show a skeleton card state (grey rectangle placeholders) as a variant

> 🍰 **Theobroma inspiration:** Theobroma's original site had no filters and no price on cards. BakeEase directly fixes both — price is always visible on the card, and the sidebar lets users filter without hunting.

---

### Page: Feedback & Contact Us

**Two-column layout:**

**Left — Contact Info Card (400px):**
1. White card, radius `12`, shadow
2. BakeEase logo/icon at top
3. Icon + `"123, FC Road, Mumbai - 400001"` (address)
4. Icon + `"+91 98765 43210"` (phone, underline to suggest click-to-call)
5. Icon + `"hello@bakeease.in"` (email)
6. Operating hours mini-table: Mon–Sat 8am–9pm, Sun 9am–8pm
7. Grey rectangle placeholder for Google Maps embed

**Right — Feedback Form:**
1. Form title: `"We'd Love to Hear From You"` — `Heading/H2`
2. Input fields: Full Name, Email, Phone (optional label), Subject dropdown
3. Message textarea (taller input, `120px` min height)
4. Star rating widget:
   - Label: `"Rate your experience"`
   - 5 star shapes (★) in a row — empty state `#CCCCCC`, filled state `Accent (#F4A261)`
   - Show a hover/selected state variant
5. File attachment: dashed border box with `"📎 Attach a photo (optional)"` text
6. Submit button (Primary, full width)
7. **Success state:** Replace form content with a centred illustration + `"Thank you! We'll get back to you shortly."` text

**Below both columns — FAQ Accordion:**
1. Section heading: `"Frequently Asked Questions"`
2. 5 accordion items:
   - `"What areas do you deliver to in Mumbai?"` — show one item in OPEN state (answer visible)
   - `"How far in advance should I order a custom cake?"`
   - `"What payment methods do you accept?"`
   - `"Can I modify or cancel my order?"`
   - `"Do you have options for dietary restrictions?"`
3. Each item: full-width row, question text left, `▼` or `▲` chevron right, divider below

---

## 4. Theobroma Inspiration — What to Borrow & What to Fix

Theobroma is a beloved Mumbai bakery. Study their aesthetic — but UX research shows their website has well-known problems. Here's your cheat sheet:

### ✅ What to borrow from Theobroma

| What | How to apply in BakeEase |
|---|---|
| **Warm, rich photography** | Use large, moody, warm-lit product images. Let the food be the hero. |
| **Dark brown + gold palette** | Your `#B05E2D` Primary and `#F4A261` Accent already mirror this |
| **Patisserie/artisan feel** | Use Playfair Display for headings — it has that hand-crafted elegance |
| **Premium product presentation** | Each cake gets its own card with ample white space — never cluttered |
| **Category-focused navigation** | Horizontal category pills make products easy to reach in 1 click |
| **Occasion-based browsing** | Filter by Birthday, Wedding, etc. — Theobroma's brand is built on celebrations |

### ❌ What Theobroma does wrong — and BakeEase fixes

| Theobroma Pain Point | BakeEase Solution |
|---|---|
| **No price shown on product listing** | Price is always visible on the Product Card, in `Primary` colour |
| **No Add to Cart from the listing** | Every product card has an `"Add to Cart"` button — no forced page redirect |
| **No user account / order history** | Full login system + user dashboard with order tracking |
| **Veg/non-veg indicator missing or tiny** | Green/red dot badge on every product card, always visible |
| **Order online button didn't work** | Your entire platform IS the ordering system — it's the core feature |
| **Outdated, inconsistent typography** | Strict text style system in Figma; Inter for body = clean and modern |
| **No active state on navbar** | Active nav link gets `Primary` colour + `2px` bottom border underline |
| **Cluttered layout, poor spacing** | 8px grid, generous card padding, consistent section spacing |
| **No search or filtering** | Full-featured search bar + sidebar filters on catalogue page |
| **No cart — can only order one item** | Full shopping cart with quantity updates and multi-item checkout |

---

## 5. Prototyping & Linking Screens

After designing all 4 pages, create a clickable prototype:

1. Switch to **Prototype** tab (top right panel)
2. Click a component → Drag the **blue arrow** to the destination frame
3. Set **Interaction**: `On Click` → `Navigate to` → select destination frame
4. Trigger: `Instant` or `Smart Animate` (for tab switches, use Smart Animate for a smooth feel)

**Minimum flows to create:**

| From | Trigger | To |
|---|---|---|
| Login Page — `"Login"` button | On Click | Homepage |
| Homepage — `"Register"` link | On Click | Register tab on Login page |
| Homepage Navbar — `"Menu"` | On Click | Catalogue Page |
| Homepage — `"Contact"` footer link | On Click | Feedback Page |
| Catalogue Page — Navbar logo | On Click | Homepage |
| Login tab button | On Click | Show Login form (component swap) |
| Register tab button | On Click | Show Register form (component swap) |
| Mobile hamburger `☰` | On Click | Open mobile menu overlay |

**To present:** Click ▶ **Present** button (top right) → share the prototype link with your professor.

---

## 6. Exporting for PPT

1. Select the frame you want to export
2. Right panel → **Export** section → click `"+"`
3. Set: `2x` scale, format `PNG`
4. Click **Export [frame name]**
5. For the PPT: paste the exported images directly — they'll be crisp at 2x resolution

**What to export:**

- [ ] Login page — Desktop frame
- [ ] Login page — Mobile frame
- [ ] Homepage — Desktop frame (full scroll or split into sections)
- [ ] Catalogue page — Desktop frame
- [ ] Contact page — Desktop frame

---

## 7. Figma Tips for Beginners

| Shortcut | What it does |
|---|---|
| `F` | Frame tool — create a new frame/artboard |
| `R` | Rectangle tool |
| `T` | Text tool |
| `Shift + A` | Add Auto Layout to selected elements |
| `Ctrl/Cmd + D` | Duplicate selected element |
| `Ctrl/Cmd + G` | Group selected elements |
| `Ctrl/Cmd + Option/Alt + K` | Make Component from selection |
| `Ctrl/Cmd + Z` | Undo |
| `Hold Ctrl/Cmd + drag` | Deep-select inside a group |
| `Alt + drag` | Copy element while dragging |
| `Ctrl/Cmd + \` | Show/hide left panel |
| `Space + drag` | Pan the canvas |

### Auto Layout — your best friend

Auto Layout makes elements resize and reflow automatically — just like CSS Flexbox. Use it on EVERYTHING:

- Select 2+ elements → `Shift + A`
- Set direction (Horizontal or Vertical)
- Set gap between items
- Set padding inside the container
- Elements will now push each other when resized

### Using Plugins (optional but useful)

Install from **Figma Community** (menu → Community → Plugins):

| Plugin | Use |
|---|---|
| **Unsplash** | Insert real food photography into your designs |
| **Iconify** | Access Lucide, Material, and 100k+ icons |
| **Lorem ipsum** | Fill text areas with placeholder text |
| **Stark** | Check colour contrast ratio (accessibility) |
| **Figma to HTML** | Optional — export basic HTML from designs |

---

*BakeEase — Web Programming Lab Mini Project | SDG 8 | March 2026*
