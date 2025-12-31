# Walkthrough - Hybrid Monolith POS System

> **Update Terakhir**: 31 Desember 2024

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

### 1. Otentikasi

- Magic Link (Email)
- Google OAuth
- Reset Password via Email

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

### 6. Loyalty System

- Voucher per branch
- Customer Points (auto-add via trigger)

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

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Realtime)
- **Email**: Brevo (Transactional)
- **UI Admin**: Selia Components (Shadcn style)
- **UI Mobile**: Konsta UI
- **Styling**: Tailwind CSS v4
