# Zencode System Overview

This document provides a technical and functional overview of the **Zencode POS** system as of January 2026.

---

## 1. Branding & Identity

The system has been fully rebranded as **Zencode**.

- **Mission**: Professional Software House.
- **Identity**: Minimalist, premium, and trustworthy.
- **Primary Colors**: Slate/Dark Grays with Primary accents.

## 2. Progressive Web App (PWA)

Zencode POS is a fully capable PWA.

- **Manifest**: Located at `public/manifest.json`.
- **Service Worker**: `public/sw.js` handles network-first caching for a smooth offline experience.
- **Registration**: Managed in `src/components/pwa/service-worker-registration.tsx`.

## 3. Localization & Formatting

The system is built for an international standard while respecting local contexts.

- **Language**: Global UI text is in **English**.
- **Currency**: Numbers are formatted using the Indonesian standard (**IDR**).
- **Helper**: `formatIDR` utility in `src/lib/utils.ts` (e.g., `1.000.000`).

## 4. Authentication & Security (RBAC)

The system uses Supabase Auth coupled with a custom `public.users` table to manage 4 distinct roles:

### superadmin

- Access to Headquarters Dashboard.
- Manage all branches, staff, and global product catalog.
- View email logs and system-wide reports.

### admin

- Access to Branch Dashboard for their assigned location.
- Manage branch-specific product availability, vouchers, and local reports.

### cashier

- Access to the **POS / Cashier** interface.
- Manage real-time customer orders, modifiers, and daily transactions.

### customer

- Primary users of the **Mobile App**.
- Browsing menu, managing cart, viewing points/vouchers, and placing orders.

## 5. Staff Accounts (Test Access)

Initial staff accounts are created with password `Test@123`.

- `superadmin@test.com`
- `admin@test.com`
- `cashier@test.com`
- `customer@test.com` (for testing signup/mobile flow)

---

_Created on: January 1, 2026_
