# Ataa (عطاء) — Modern Donation Management Platform

<div align="center">

**A modern, trustworthy, high-impact Progressive Web App (PWA) connecting donors directly with verified families in need.**

[![React](https://img.shields.io/badge/React-19.x-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.x-38b2ac.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8.svg?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![i18n](https://img.shields.io/badge/i18n-Arabic%20(Default)%20%7C%20English-0F766E.svg?style=flat)](https://react.i18next.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 Overview & Mission

**Ataa (عطاء)** is a social-impact fintech web platform built to revolutionize direct, dignified humanitarian giving. It connects donors directly with verified family cases in Egypt and the MENA region with **100% financial transparency**.

Unlike traditional charity systems where donations are pooled into generic funds, Ataa allows donors to:
1. Browse verified families and specific urgent needs (medical surgeries, dialysis, rent arrears, school tuition, debt relief for female breadwinners, disaster restoration).
2. Choose public or anonymous giving with a single click.
3. Pay via modern local payment methods (**InstaPay**, **Vodafone Cash / Orange / Etisalat / WE**, **Visa / MasterCard / Meeza**, **Fawry**, and **PayPal** for international donors).
4. Track their donation step-by-step using an official electronic Reference ID from pending, to gateway confirmation, to real-world delivery.

---

## 💡 Dual Funding Model: Families + Platform Operations

To guarantee that **100% of family pledges reach beneficiaries without administrative cuts**, Ataa employs a dual-stream model:

- **Family Relief Cases**: 100% of designated funds go directly towards family needs or the service provider (e.g., hospital, landlord, university).
- **Platform Infrastructure Fund**: A separate, transparent fund where supporters and businesses can contribute to cloud hosting (AWS), managed PostgreSQL databases, SMS/email communications, and security audits. Donors can also add an optional maintenance tip during checkout.

---

## 🚀 Key Features

### 🌍 Bilingual Arabic (Default) & English with Native RTL Support
- **Arabic is default** on initial load with complete RTL layout flipping.
- One-click prominent **EN/AR toggle button** in the header.
- High-legibility typography: **Cairo** font for Arabic, **Plus Jakarta Sans** and **Inter** for English.
- Locale-aware currency formatting (`١٬٥٠٠ ج.م` / `EGP 1,500`) and localized date formatters.

### 🌓 Dark and Light Mode
- Three supported modes: **Light** (warm stone palette), **Dark** (charcoal slate), and **System**.
- Smooth theme toggle with animated sun/moon icon transitions.
- High-contrast status badges and responsive Recharts charts that adapt colors in both modes.

### 📱 Progressive Web App (PWA)
- Fully installable on iOS, Android, macOS, and Windows via supported browsers.
- Service worker precaching for static assets and offline fallback page.
- Native mobile bottom navigation bar for a true app-like experience.

### 🛡️ Field Verification & Privacy Preservation
- Strict 4-step field verification workflow.
- Family identities protected by privacy-safe profiles (full names and private addresses are shielded; only general governorates and verified codes like `FAM-1042` are shown).

### 💳 Simulated Modern Payment Gateway Flow
- Realistic mock flow: `PENDING` → `PROCESSING` → `COMPLETED` / `FAILED`.
- Celebration confetti on success, official downloadable and printable receipt (`.txt` / `.pdf`), and immediate tracking redirection.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Routing** | React Router v7 |
| **Styling & Design System** | Tailwind CSS v3 + Custom Design Tokens |
| **Icons** | Lucide React |
| **Charts & Visualization** | Recharts (SVG declarative charts) |
| **Internationalization (i18n)** | i18next + react-i18next + LanguageDetector |
| **Animations & Micro-interactions** | Framer Motion (Motion) |
| **Toast Notifications** | Sonner |
| **Date Utilities** | date-fns |
| **PWA & Offline** | vite-plugin-pwa (Workbox) |

---

## 🏗️ Project Structure

```
Donation-Platform/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg             # Brand SVG favicon
│   │   ├── offline.html            # PWA offline fallback screen
│   │   ├── robots.txt
│   │   └── icons/                  # PWA application icons
│   ├── src/
│   │   ├── api/                    # API Service Layer & client placeholders
│   │   │   ├── config.js
│   │   │   ├── client.js
│   │   │   ├── families.js
│   │   │   ├── donations.js
│   │   │   ├── auth.js
│   │   │   ├── payments.js
│   │   │   ├── admin.js
│   │   │   ├── notifications.js
│   │   │   └── platform.js
│   │   ├── components/
│   │   │   ├── ui/                 # Atomic UI primitives (Button, Card, Input, Modal, Badge...)
│   │   │   ├── common/             # Domain components (FamilyCard, ServiceCard, StatusBadge, Timeline...)
│   │   │   └── layout/             # Navigation headers, footers, sidebars, mobile bottom bar
│   │   ├── data/                   # Realistic seed data for families, donations, and metrics
│   │   ├── i18n/                   # 14 translation namespaces (Arabic & English)
│   │   ├── layouts/                # PublicLayout, DashboardLayout, AdminLayout
│   │   ├── lib/                    # Formatters, validators, constants, utils
│   │   ├── pages/
│   │   │   ├── public/             # 14 Public pages
│   │   │   ├── auth/               # 3 Authentication pages
│   │   │   ├── dashboard/          # 9 Family Representative pages
│   │   │   └── admin/              # 11 Administrator pages
│   │   ├── routes/                 # Central router with dynamic code splitting
│   │   ├── store/                  # React Contexts (ThemeContext, AuthContext, DonationContext, AppContext)
│   │   ├── styles/                 # Global styles and Tailwind configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── LICENSE
├── package.json                    # Root workspace launcher
└── README.md
```

---

## 💻 Getting Started & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **yarn** / **pnpm**

### Installation & Launch

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yzes95/Donation-Platform.git
   cd Donation-Platform
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build for production & PWA validation**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📋 Roadmap & Project Tasks

### ✅ Completed Tasks (Frontend Milestone 1)
- [x] Modern UI/UX design with social-impact & fintech aesthetics.
- [x] Full bilingual support with Arabic (Default) & English + RTL layout.
- [x] Dark, Light, and System Theme mode support.
- [x] Complete PWA setup with web manifest, service worker, and bilingual offline fallback.
- [x] Public, Family Representative, and Admin governance portals.
- [x] Unified Status Badge system supporting Family, Assistance, Donation, and Payment states in both themes.
- [x] Celebration confetti, downloadable donation receipt, and live reference ID tracking.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
