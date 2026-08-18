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

## 🧭 Page Routes & Site Architecture

The frontend is structured into three clear portals across **36 distinct routes**:

### Public Portal
1. **Home (`/`)**: Hero with search, impact statistics, urgent needs, categories, 3-step workflow, trust section, testimonials, and platform support banner.
2. **Family Directory (`/families`)**: Search bar, category filters, governorate filters, urgency filters, sorting, and responsive family cards with funding progress.
3. **Family Profile (`/families/:id`)**: Privacy-safe family overview, verification badges, assistance needs list, and recent donation history.
4. **Need Details (`/services/:id`)**: Single need details, financial target, progress bar, beneficiary explanation, and direct donation CTA.
5. **Donation Checkout (`/donate`)**: Multi-step checkout with preset amounts (EGP 50 to 5,000), custom amount, anonymous toggle, optional platform tip, and payment method selector.
6. **Payment Processing (`/payment/processing/:referenceId`)**: Animated telemetry showing real-time gateway handshake.
7. **Donation Confirmation (`/donation/confirmation/:referenceId`)**: Celebration, reference ID, payment details, receipt download, and tracking link.
8. **Donation Tracking (`/track`)**: Reference code lookup with 5-stage milestone timeline.
9. **Support Platform (`/support-platform`)**: Transparent breakdown of operational costs (AWS, database, payment fees, SMS) and dedicated platform donation form.
10. **Platform Transparency (`/transparency`)**: Visual charts for category allocation, monthly donation volumes, and independent accounting audit statements.
11. **About Us (`/about`)**: Vision, mission, and field verification philosophy.
12. **Contact Us (`/contact`)**: Support inquiry form, hotline contacts, and interactive FAQ accordion.

### Authenticated Family Representative Portal
13. **Login (`/login`)**: Secure login with demo credential quick-fill.
14. **Registration (`/register`)**: Request family access and field visit.
15. **Dashboard (`/dashboard`)**: Total donations received, active needs, completed needs, and donation growth area chart.
16. **Family Profile Management (`/dashboard/profile`)**: Update family background, housing status, and family members count.
17. **Needs Management (`/dashboard/needs`)**: List of all family assistance needs with status filters and edit/delete actions.
18. **Create Need (`/dashboard/needs/create`)**: Submit assistance request with document upload placeholder.
19. **Edit Need (`/dashboard/needs/edit/:id`)**: Modify an existing assistance request.
20. **Donation History (`/dashboard/donations`)**: Searchable list of all received donations with CSV export.
21. **Donation Details (`/dashboard/donations/:id`)**: Deep view with receipt download.
22. **Notifications (`/dashboard/notifications`)**: Alerts for new donations and verification milestones.
23. **Account Settings (`/dashboard/settings`)**: Password changes, SMS/Email alerts, and language/theme preferences.

### Admin & Governance Portal
24. **Admin Login (`/admin/login`)**: Administrator portal authentication.
25. **Admin Dashboard (`/admin`)**: High-level platform statistics, family donations vs platform donations comparison, pending queue alerts, and live audit feed.
26. **Family Directory Management (`/admin/families`)**: Full registry of families with status toggle (Verified / Suspended).
27. **Family Verification Queue (`/admin/verifications`)**: Pending field requests with approval/rejection modal.
28. **Assistance Review (`/admin/needs-review`)**: Medical and housing assistance requests review.
29. **Donations Monitoring (`/admin/donations`)**: All transactions with filter by type (Family vs Platform) and suspicious transaction flagging.
30. **Payments Telemetry (`/admin/payments`)**: Gateway status for InstaPay, Vodafone Cash, Visa, and manual reconciliation tool.
31. **User Management (`/admin/users`)**: Role and permissions control for administrators, researchers, and family reps.
32. **Reports & Analytics (`/admin/reports`)**: Category breakdown pie charts, monthly bar charts, and exportable reports.
33. **Audit Trail (`/admin/audit-logs`)**: Immutable administrative activity log with IP addresses and timestamps.
34. **Notifications Broadcast (`/admin/notifications-mgmt`)**: Send SMS/App announcements to all families or specific audiences.
35. **Platform Settings (`/admin/settings`)**: Configure monthly operational targets, FastAPI backend URL, and AWS regions.

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

## 🔌 API Service Layer & FastAPI Backend Integration

The frontend is completely decoupled from any hardcoded backend. All data interactions pass through a clean service layer located in `frontend/src/api/`.

### Configuration
In `frontend/src/api/config.js`:
```javascript
// Switch to live FastAPI backend when ready:
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // Set VITE_USE_MOCK=false in .env
```

### Expected Future FastAPI REST Endpoints

| Frontend API Function | Expected FastAPI Route | Description |
|---|---|---|
| `getFamilies(filters)` | `GET /api/v1/families` | List all verified families with search and filters |
| `getFamily(id)` | `GET /api/v1/families/{id}` | Single family details with active services |
| `getFamilyServices(familyId)` | `GET /api/v1/families/{id}/services` | Assistance services for a specific family |
| `createDonation(data)` | `POST /api/v1/donations` | Initiate a donation order & get reference ID |
| `trackDonation(ref)` | `GET /api/v1/donations/track/{ref}` | Public donation status & delivery milestones |
| `createPlatformDonation(data)`| `POST /api/v1/platform/donations` | Submit platform infrastructure support donation |
| `login(credentials)` | `POST /api/v1/auth/login` | Returns JWT Bearer token |
| `getAdminDashboard()` | `GET /api/v1/admin/dashboard` | Administrative overview metrics & audit logs |
| `verifyFamily(id, action)` | `POST /api/v1/admin/verifications/{id}/action`| Approve/reject family verification |

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
│   │   ├── api/                    # API Service Layer & FastAPI integration points
│   │   │   ├── config.js
│   │   │   ├── client.js           # Generic fetch client wrapper
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
│   │   │   ├── public/             # 12 Public pages
│   │   │   ├── auth/               # 3 Authentication pages
│   │   │   ├── dashboard/          # 10 Family Representative pages
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
   git clone https://github.com/your-username/ataa-donation-platform.git
   cd ataa-donation-platform
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
- [x] All 12 Public pages (Home, Directory, Profile, Service Details, Checkout, Processing, Confirmation, Tracking, Platform Support, Transparency, About, Contact).
- [x] All 3 Auth pages (Family Login, Family Registration Request, Admin Login).
- [x] All 10 Family Representative Dashboard pages (Overview, Profile, Needs, Create Need, Edit Need, History, Details, Notifications, Settings).
- [x] All 11 Admin Panel pages (Overview, Family Registry, Verification Queue, Needs Review, Donations, Payments, Users, Analytics, Audit Trail, Broadcasts, Settings).
- [x] Unified Status Badge system supporting Family, Assistance, Donation, and Payment states in both themes.
- [x] Mock data and decoupled API service layer ready for future FastAPI integration.
- [x] Celebration confetti, downloadable donation receipt, and live reference ID tracking.

### ⏳ Upcoming Tasks (Backend & Cloud Integration)
- [ ] Connect FastAPI backend to replace mock service layer.
- [ ] Integrate PostgreSQL database with SQLAlchemy / Tortoise ORM models.
- [ ] Connect real payment gateway webhooks (InstaPay IPN, Vodafone Cash Merchant API, Paymob / Fawry).
- [ ] Configure AWS infrastructure (EC2 / ECS Fargate, S3 encrypted document vault, CloudFront CDN, and Lambda webhook triggers).
- [ ] Implement SMS notification service via AWS SNS or local telecom gateway.
- [ ] Conduct end-to-end automated accessibility (WCAG 2.1 AA) and Lighthouse audits.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
