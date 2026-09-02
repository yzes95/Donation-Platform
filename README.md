# Ataa (عطاء) — Family Donation Management Platform

<div align="center">

**A modern, trustworthy Progressive Web App (PWA) dedicated to family donation management, connecting donors directly with verified families in need.**

[![React](https://img.shields.io/badge/React-19.x-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.x-38b2ac.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8.svg?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![i18n](https://img.shields.io/badge/i18n-Arabic%20(Default)%20%7C%20English-0F766E.svg?style=flat)](https://react.i18next.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 Overview & Purpose

**Ataa (عطاء)** is a specialized **Family Donation Management Platform** designed for direct, dignified humanitarian aid and family relief. The platform enables direct financial empowerment of verified families with **100% financial transparency**.

### Core Platform Capabilities:
1. **Direct Family Aid**: Donors browse verified family cases and specific urgent needs (medical treatment, debt relief, rent arrears, home repairs, educational support).
2. **Family Scope Filtering**: Support for registered tribal and private family lineages (such as *Abo Nafee* and *Aboshwemy* of the Tarabin tribe) alongside public charitable initiatives.
3. **Public & Anonymous Giving**: Donors can contribute publicly or choose complete anonymity with one click.
4. **Local & Global Payment Gateways**: Simulated flows for **InstaPay**, **Vodafone Cash / Orange / Etisalat / WE**, **Visa / MasterCard / Meeza**, **Fawry**, and **PayPal**.
5. **Electronic Tracking**: Every donation is issued an official Reference ID for step-by-step transparency from initiation to field delivery.

---

## 💡 Dual-Funding Model

To ensure **100% of donor family pledges reach beneficiaries without administrative deductions**, Ataa utilizes a dual-funding architecture:

- **Family Pledges**: 100% of designated funds go directly toward the family case or specified service provider (e.g., landlord, pharmacy, clinic).
- **Platform Operations Fund**: A dedicated, independent fund where donors can optionally contribute to cloud hosting, database maintenance, and operational overhead.

---

## 👨‍👩‍👧‍👦 Registered Family Cases

The platform manages verified family cases with strict field researcher documentation
---

## 🚀 Key Features

### 🌍 Bilingual Support (Arabic Default & English)
- **Arabic as default language** with native RTL layout.
- Synchronized English mode with one-click language toggle.
- Typography powered by **Cairo** (Arabic) and **Plus Jakarta Sans** / **Inter** (English).
- Locale-aware currency formatting (`١٬٥٠٠ ج.م` / `EGP 1,500`) and date localization.

### 🌓 Theme Modes
- Full support for **Dark Mode**, **Light Mode**, and **System Theme**.
- Dynamic 3D interactive ambient canvas that adapts its color palette to active themes.

### 📱 Progressive Web App (PWA)
- Installable on mobile (iOS, Android) and desktop (Windows, macOS).
- Service worker precaching and bilingual offline support.
- Mobile bottom navigation bar for seamless smartphone usability.

### 🛡️ Field Verification & Multi-Portal Access
- **Public Portal**: Case discovery, family directories, and transparent donation checkout.
- **Family Representative Portal**: Case registration, needs updates, and real-time donation monitoring.
- **Admin Governance Portal**: Field researcher verification workflows, payment audits, and platform settings.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v3 + Custom Design Tokens |
| **Icons** | Lucide React |
| **Charts** | Recharts (SVG declarative charts) |
| **Localization (i18n)** | i18next + react-i18next |
| **Animations** | Framer Motion |
| **Toast Notifications** | Sonner |
| **PWA & Offline** | vite-plugin-pwa (Workbox) |

---

## 🏗️ Project Structure

```text
Donation-Platform/
├── frontend/
│   ├── public/
│   │   ├── 404.html                # Single-Page App router fallback
│   │   ├── favicon.svg
│   │   ├── offline.html
│   │   └── icons/
│   ├── src/
│   │   ├── api/                    # API client and service layer
│   │   ├── components/
│   │   │   ├── ui/                 # UI primitives (Button, Card, Input, Modal, Badge...)
│   │   │   ├── common/             # Domain components (BrandLogo, FamilyCard, InteractiveBackground...)
│   │   │   └── layout/             # Headers, Footers, Sidebars, Bottom Navigation
│   │   ├── data/                   # Family and donation data
│   │   ├── i18n/                   # Arabic & English translation locales
│   │   ├── layouts/                # PublicLayout, DashboardLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/             # Public browsing and checkout pages
│   │   │   ├── auth/               # Authentication portals
│   │   │   ├── dashboard/          # Family representative management
│   │   │   └── admin/              # Governance and verification dashboard
│   │   ├── routes/                 # Central router with code splitting
│   │   ├── store/                  # React Contexts (Theme, Auth, Donation, App)
│   │   ├── styles/                 # Tailwind design tokens and glassmorphic styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or yarn / pnpm)

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
   Open your browser at `http://localhost:3000` (or the Vite dev URL).

4. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
