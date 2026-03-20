# 🧁 BakeEase

> **Online Bakery Ordering & Delivery Platform**
> Web Programming Lab — Mini Project | Team of 3 | March 2026

[![SDG 8](https://img.shields.io/badge/SDG-8%20Decent%20Work%20%26%20Economic%20Growth-orange)](https://sdgs.un.org/goals/goal8)
[![Stack](https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS%20%2B%20Node.js%20%2B%20MySQL-blue)](#)
[![Payments](https://img.shields.io/badge/Payments-Razorpay%20UPI%20%2B%20COD-green)](#)

---

## 📖 About

BakeEase is a full-stack web application that digitises local bakery businesses by providing a seamless online storefront, order management, UPI/COD payments, and a **Purble Palace-inspired mini-game** (BakeMaster) for customer engagement.

It supports two user types — **Customers** who browse and order, and **Admins** who manage products, orders, inventory, and view sales reports.

---

## 📄 Documentation

| Document | Description |
|---|---|
| [📋 PRD.md](./PRD.md) | Product Requirements Document — features, user stories, functional & non-functional requirements |
| [🎨 DESIGN.md](./DESIGN.md) | Design Document — colour palette, typography, page-by-page UI specs, database schema |
| [⚙️ TECH_STACK.md](./TECH_STACK.md) | Tech Stack Document — architecture, packages, API endpoints, auth flow, Razorpay integration, team split |

---

## 🗂️ Pages (Mid-Term Scope)

| Page | Description |
|---|---|
| Registration / Login | Account creation and login with role-based access |
| Homepage / Landing | Hero, featured products, category pills, promo banner, game CTA |
| Product Catalogue & Search | Filter, sort, search across all bakery products |
| Feedback / Contact Us | Contact info, feedback form with star rating, FAQ accordion |

---

## 🛠️ Tech Stack

```
Frontend   →  HTML5 · CSS3 · Vanilla JavaScript (ES6+) · fetch() API
Backend    →  Node.js 20 LTS · Express.js 4 · mysql2
Database   →  MySQL 8 (via XAMPP / phpMyAdmin)
Auth       →  JWT + bcrypt · localStorage
Payments   →  Razorpay (UPI · COD) via CDN script
Storage    →  Cloudinary (product image uploads)
```

No frontend frameworks. No build tools. Just files you open in a browser.

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/your-org/bakeease.git
cd bakeease

# Backend
cd server && npm install && cp .env.example .env && node server.js

# Frontend
# Open client/index.html with VS Code Live Server (right-click → Open with Live Server)
```

> Fill in `server/.env` with your DB credentials, JWT secret, and Razorpay test keys.
> See [TECH_STACK.md](./TECH_STACK.md) for all required env variables and full setup steps.

---

## 🎮 BakeMaster Mini-Game

An in-app baking game inspired by **Purble Shop** from Purble Palace. Players fill customer cake orders by selecting the correct base, frosting, and decorations before the timer runs out. Three difficulty levels, 1–3 star scoring, session high score.

---

## 🌍 SDG Alignment

This project supports **SDG 8 — Decent Work & Economic Growth** by providing small Mumbai bakeries with a digital platform to expand their reach, automate operations, and grow revenue through online ordering.

---

## 👥 Team

| Member | Role |
|---|---|
| Member 1 | Frontend — Core Pages (Homepage, Catalogue, Auth, Contact) |
| Member 2 | Backend + Database (API, Auth, Payments, Schema) |
| Member 3 | Frontend — Features + Game (Cart, Checkout, Dashboard, Admin, BakeMaster) |

---

*Web Programming Lab Mini Project · March 2026*
