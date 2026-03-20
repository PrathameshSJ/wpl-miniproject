# 🧁 BakeEase — Product Requirements Document (PRD)

> **Project:** BakeEase — Online Bakery Ordering & Delivery Platform
> **Team:** Team of 3 | Web Programming Lab | March 2026
> **SDG Alignment:** SDG 8 – Decent Work & Economic Growth

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Roles & Personas](#2-user-roles--personas)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [User Stories](#5-user-stories)

---

## 1. Project Overview

BakeEase is a full-stack web application serving as an online bakery ordering and delivery platform. It bridges the gap between local Mumbai bakeries and their customers by providing a seamless digital storefront, order management system, and a fun in-app mini-game for engagement.

This project aligns with **SDG 8 – Decent Work and Economic Growth** by digitising small bakery businesses, enabling them to reach wider audiences, automate their operations, and increase revenue through an accessible online presence.

### 1.1 Problem Statement

Small and medium bakeries in Mumbai rely primarily on walk-in customers and informal WhatsApp orders. This creates:

- Limited customer reach beyond the neighbourhood
- Manual order tracking errors and miscommunications
- No digital payment support (UPI, card)
- No order history or customer analytics
- No way to manage inventory or spot trends

BakeEase solves all of these with a centralised, modern web platform.

### 1.2 Project Goals

- Allow customers to browse, customise, and order bakery products online
- Provide secure UPI and Cash-on-Delivery payment support
- Help bakery staff manage products, orders, and inventory via an admin panel
- Increase customer engagement with a Purble-Palace-inspired baking mini-game
- Generate actionable business insights through a reporting dashboard

### 1.3 Scope

**In Scope — Mid-Term Submission:**
- Registration / Login page (customer + admin)
- Homepage / Landing page
- Product Catalogue & Search page
- Feedback / Contact Us page
- Database schema design

**In Scope — Full Project:**
- Custom Cake Builder
- Cart & Checkout with UPI / COD
- User Order Tracking Dashboard
- Admin Panel (products, orders, inventory, reports)
- Mini-game: BakeMaster (Purble Shop-inspired)

**Out of Scope:**
- Mobile native app (iOS/Android)
- Multi-branch bakery support
- AI-based product recommendations
- POS hardware integration

---

## 2. User Roles & Personas

### 2.1 Customer

> Typical user: A 18–35 year old Mumbai resident ordering cakes for personal occasions or daily snacks. Comfortable with UPI. Expects a smooth mobile-friendly experience.

| Capability | Description |
|---|---|
| Browse & Search | View products by category, search by name, filter by occasion/flavour |
| Customise Cakes | Select size, flavour, frosting, theme, and add a custom message |
| Place Orders | Add to cart, apply promo codes, checkout with UPI or COD |
| Track Orders | View live order status from Pending → Baking → Out for Delivery → Completed |
| Reviews | Rate and review purchased products |
| Play Game | Access the BakeMaster mini-game from the homepage |

### 2.2 Admin / Bakery Staff

> Typical user: Bakery owner or staff managing day-to-day operations. May not be highly tech-savvy; needs a clean, simple dashboard.

| Capability | Description |
|---|---|
| Product Management | Add, edit, disable products and categories |
| Order Management | View and update order statuses, print invoices |
| Inventory | Monitor stock levels, receive low-stock alerts |
| Reports | View daily/monthly sales, best-sellers, customer stats |
| Reviews | Moderate (approve/reject) customer reviews |

---

## 3. Functional Requirements

### 3.1 Authentication

| ID | Feature | Description | Priority |
|---|---|---|---|
| FR-01 | Register | Customer creates account with name, email, phone, password | 🔴 High |
| FR-02 | Login / Logout | Email/password login with JWT session tokens | 🔴 High |
| FR-03 | Password Reset | Email-based OTP password reset flow | 🟡 Medium |
| FR-04 | Role Access Control | Separate routes and views for Customer vs Admin | 🔴 High |

### 3.2 Product Catalogue

| ID | Feature | Description | Priority |
|---|---|---|---|
| FR-05 | Browse Products | Grid view with image, name, price, star rating | 🔴 High |
| FR-06 | Category Filter | Filter by: Cakes, Pastries, Cupcakes, Bread, Custom | 🔴 High |
| FR-07 | Search | Real-time search bar with debounced results | 🔴 High |
| FR-08 | Sort & Filter | Sort by price/popularity/newest; filter by occasion and flavour | 🟡 Medium |
| FR-09 | Product Detail Page | Gallery, description, size/flavour options, add-ons, reviews | 🔴 High |

### 3.3 Ordering & Checkout

| ID | Feature | Description | Priority |
|---|---|---|---|
| FR-10 | Shopping Cart | Add/remove items, update quantities, view subtotal | 🔴 High |
| FR-11 | Custom Cake Builder | Select size, flavour, frosting, theme, message; upload reference image; live price preview | 🔴 High |
| FR-12 | Promo Codes | Apply coupon at cart stage for discount | 🟡 Medium |
| FR-13 | Checkout | Select delivery or pickup, address, date/time, payment method | 🔴 High |
| FR-14 | Payment – UPI | Razorpay integration for UPI payments (GPay, Paytm, PhonePe) | 🔴 High |
| FR-15 | Payment – COD | Cash on delivery option at checkout | 🔴 High |

### 3.4 Order Tracking & User Dashboard

| ID | Feature | Description | Priority |
|---|---|---|---|
| FR-16 | Order History | View all past orders with status and invoice download | 🔴 High |
| FR-17 | Live Status Tracking | Stages: Pending → Baking → Out for Delivery → Completed | 🔴 High |
| FR-18 | Profile Management | Edit personal details, save multiple delivery addresses | 🟡 Medium |

### 3.5 Admin Panel

| ID | Feature | Description | Priority |
|---|---|---|---|
| FR-19 | Product CRUD | Add/edit/delete products, upload images, set prices, toggle availability | 🔴 High |
| FR-20 | Order Management | View all orders, filter by status/date, update status, print invoice | 🔴 High |
| FR-21 | Inventory Tracking | Track ingredient stock, low-stock alerts, auto-deduct on order | 🟡 Medium |
| FR-22 | Sales Reports | Daily/monthly revenue charts, best-sellers, customer stats | 🟡 Medium |
| FR-23 | Review Moderation | View and approve/reject customer reviews | 🟢 Low |

### 3.6 BakeMaster Mini-Game

Inspired by **Purble Shop** from Purble Palace, BakeMaster is a browser-based mini-game embedded in BakeEase. It is purely for entertainment — no real-world rewards tied to gameplay.

**Gameplay Loop:**
1. Player is shown a customer order card (e.g. *"Chocolate sponge, vanilla frosting, 3 candles"*)
2. Player selects ingredients by clicking layered ingredient trays in order: **base → flavour → frosting → decoration**
3. A timer counts down — faster completion earns more stars (1–3 ⭐)
4. Wrong ingredient triggers a shake animation and deducts time
5. Result screen shows stars earned, time taken, and options to play again or return to shop

**Difficulty Levels:**

| Level | Timer | Toppings |
|---|---|---|
| Easy | No timer | 2 decoration choices |
| Medium | 60 seconds | 4 decoration choices |
| Hard | 40 seconds | 6 decoration choices, faster pace |

**Other details:**
- High score stored in `localStorage` per browser session
- Accessible via a `Play` button in the main navigation and homepage
- Game loads in under 2 seconds; fully playable on mobile and desktop

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Page load under 3 seconds on 4G; API responses under 500ms |
| **Responsiveness** | Fully mobile-responsive; tested at 375px, 768px, 1280px |
| **Security** | JWT authentication, bcrypt password hashing, input validation & sanitisation, HTTPS in production |
| **Accessibility** | Semantic HTML, ARIA labels on interactive elements, minimum 4.5:1 colour contrast |
| **Scalability** | RESTful stateless API enabling horizontal scaling |
| **Browser Support** | Chrome, Firefox, Safari, Edge — latest 2 versions |

---

## 5. User Stories

| Role | Story | Acceptance Criteria |
|---|---|---|
| Customer | I want to search for birthday cakes so I can find the right product quickly | Search returns results within 500ms; shows image, name, price |
| Customer | I want to pay via GPay so I don't need cash | UPI payment processed via Razorpay; confirmation email sent |
| Customer | I want to track my order so I know when it will arrive | Status visible in dashboard; at least 4 stages shown |
| Admin | I want to mark an order as "Baking" so customers get updated | Status change reflects in customer dashboard within 5 seconds |
| Admin | I want to see today's sales so I can plan production | Dashboard shows daily revenue, order count, top products |
| Customer | I want to play the baking game while waiting for my order | Game loads in < 2s; playable on mobile and desktop |

---

*BakeEase — Web Programming Lab Mini Project | SDG 8 | March 2026*
