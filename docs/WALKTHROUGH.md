# Walkthrough - Zencode POS (Hybrid Monolith)

> **Update Terakhir**: 1 Januari 2026

Sistem POS Restoran dengan arsitektur "Hybrid Monolith" - satu codebase untuk Dashboard Admin dan Aplikasi Mobile Pelanggan.

---

## Arsitektur

| Interface       | Path       | UI Library     | Target  |
| --------------- | ---------- | -------------- | ------- |
| Admin Dashboard | `/admin/*` | Selia (Shadcn) | Desktop |
| Customer App    | `/app/*`   | Konsta UI      | Mobile  |

---

## Route Structure

### Admin Routes

```
/admin              → Dashboard
/admin/pos          → Kasir (POS) dengan Modifier
/admin/products     → Manajemen Produk
/admin/modifiers    → Kelola Modifier Groups & Items
/admin/vouchers     → Kelola Voucher & Promo
/admin/email-logs   → Monitoring Pengiriman Email
/admin/customers    → Data Pelanggan
/admin/reports      → Laporan Penjualan
```

### Customer Routes

```
/app                → Menu Utama
/app/cart           → Keranjang Belanja
/app/rewards        → Poin & Voucher Saya
/login              → Login Pelanggan
/forgot-password    → Lupa Password
/reset-password     → Reset Password
```

---

## Fitur Utama

### 1. Authentication (RBAC)

- **Staff**: Email + Password login via desktop.
- **Customer**: Google OAuth, Email+Password login, and Sign Up via mobile app.
- **Roles**: superadmin, admin, cashier, customer.
- **Reset Password**: Flow via email confirmation and secure update page.

### 2. POS/Kasir

- Pilih produk dari grid
- Popup modifier (Topping, Size, Level)
- Keranjang dengan kalkulasi harga otomatis
- Proses checkout ke Supabase

### 3. Product Modifier

- Modifier Groups (SINGLE/MULTIPLE)
- Modifier Items dengan price_adjust
- Junction table `product_modifiers`
- Admin CRUD di `/admin/modifiers`

### 4. Email System

- Notifikasi Order Success
- Reset Password Link
- Logging di `/admin/email-logs`

### 5. Multi-Branch

- Isolasi data per cabang
- Role-based access (ADMIN_PUSAT, BRANCH_ADMIN, KASIR)

### 6. Loyalty & Vouchers

- Voucher per branch.
- Customer Points (auto-add via trigger: 1 point per Rp 1.000).

### 7. Progressive Web App (PWA)

- Offline-ready with Service Worker.
- Add to Home Screen support (manifest.json).
- Mobile-optimized interface.

---

## Database Tables

| Table               | Deskripsi                          |
| ------------------- | ---------------------------------- |
| branches            | Daftar cabang                      |
| users               | Profil pengguna dengan role        |
| products            | Katalog produk global              |
| branch_products     | Ketersediaan per cabang            |
| modifier_groups     | Grup modifier (topping/size/level) |
| modifier_items      | Item dalam grup modifier           |
| product_modifiers   | Relasi produk-modifier             |
| transactions        | Header transaksi                   |
| transaction_details | Detail item + modifiers (JSONB)    |
| vouchers            | Kode diskon per branch             |
| customer_points     | Poin loyalty                       |
| email_logs          | Riwayat pengiriman email           |

---

## Role-Based Authentication (RBAC) Details

### Authentication Flow

- **Staff (Superadmin/Admin/Cashier)**: Managed via Email/Password login. Redirects to `/admin`.
- **Customer**: Managed via Google OAuth or Email/Password signup/login. Redirects to `/app`.

### Test Accounts (Password: `Test@123`)

| Email               | Role       | Access Scope              |
| ------------------- | ---------- | ------------------------- |
| superadmin@test.com | superadmin | Global System Dashboard   |
| admin@test.com      | admin      | Branch-specific Dashboard |
| cashier@test.com    | cashier    | POS / Cashier Interface   |
| customer@test.com   | customer   | Mobile Ordering App       |

### Setup Instructions for Developers

1. **SQL Configuration**: Run `docs/sql/create_test_users.sql` in the Supabase SQL Editor.
2. **User Creation**: Manually add users in Supabase Auth with passwords, or use the mobile signup.
3. **Role Assignment**: Ensure `public.users` table is updated with the correct `role` string.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Realtime)
- **Email**: Brevo (Transactional)
- **UI Admin**: Selia Components (Zencode Style)
- **UI Mobile**: Konsta UI
- **Styling**: Tailwind CSS v4
- **Formatting**: IDR (e.g., 1.000.000)
- **Language**: English (International Ready)
