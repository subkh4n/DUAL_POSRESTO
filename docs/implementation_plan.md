# POS RESTO - Database Schema & Relations

> **Update Terakhir**: 31 Desember 2024

Dokumentasi lengkap struktur data untuk sistem POS Multi-Branch dengan Modifier, Voucher, dan Loyalty.

---

## Entity Relationship Diagram

```mermaid
erDiagram
    BRANCHES ||--o{ USERS : "has staff"
    BRANCHES ||--o{ BRANCH_PRODUCTS : "manages"
    BRANCHES ||--o{ VOUCHERS : "issues"
    BRANCHES ||--o{ TRANSACTIONS : "records"

    USERS ||--o{ TRANSACTIONS : "cashier/customer"
    USERS ||--o| CUSTOMER_POINTS : "earns"

    CATEGORIES ||--o{ PRODUCTS : "contains"
    PRODUCTS ||--o{ BRANCH_PRODUCTS : "distributed"
    PRODUCTS ||--o{ PRODUCT_MODIFIERS : "has options"
    PRODUCTS ||--o{ TRANSACTION_DETAILS : "sold as"

    MODIFIER_GROUPS ||--o{ MODIFIER_ITEMS : "contains"
    MODIFIER_GROUPS ||--o{ PRODUCT_MODIFIERS : "linked to"

    TRANSACTIONS ||--o{ TRANSACTION_DETAILS : "includes"
    VOUCHERS ||--o{ TRANSACTIONS : "applied"
```

---

## Tabel Utama

### branches

| Column    | Type    | Description  |
| --------- | ------- | ------------ |
| id        | UUID PK |              |
| name      | TEXT    | Nama cabang  |
| address   | TEXT    | Alamat       |
| is_active | BOOLEAN | Status aktif |

### users

| Column    | Type    | Description                                |
| --------- | ------- | ------------------------------------------ |
| id        | UUID PK |                                            |
| phone     | TEXT UK | Nomor telepon                              |
| name      | TEXT    | Nama lengkap                               |
| role      | TEXT    | ADMIN_PUSAT, BRANCH_ADMIN, KASIR, CUSTOMER |
| branch_id | UUID FK | Cabang (null untuk ADMIN_PUSAT)            |

### products

| Column      | Type    | Description |
| ----------- | ------- | ----------- |
| id          | UUID PK |             |
| name        | TEXT    | Nama produk |
| category_id | UUID FK | Kategori    |
| base_price  | DECIMAL | Harga dasar |

### branch_products

| Column     | Type    | Description            |
| ---------- | ------- | ---------------------- |
| branch_id  | UUID FK | Cabang                 |
| product_id | UUID FK | Produk                 |
| is_active  | BOOLEAN | Ketersediaan di cabang |
| stock      | INTEGER | Stok lokal             |

---

## Modifier System

### modifier_groups

| Column     | Type    | Description           |
| ---------- | ------- | --------------------- |
| id         | TEXT PK | ID unik (grp-topping) |
| name       | TEXT    | Nama grup             |
| type       | TEXT    | SINGLE / MULTIPLE     |
| required   | BOOLEAN | Wajib dipilih         |
| min_select | INT     | Minimum pilihan       |
| max_select | INT     | Maksimum pilihan      |

### modifier_items

| Column       | Type    | Description        |
| ------------ | ------- | ------------------ |
| id           | TEXT PK | ID unik (mod-keju) |
| group_id     | TEXT FK | Grup modifier      |
| name         | TEXT    | Nama item          |
| price_adjust | DECIMAL | Tambahan harga     |
| available    | BOOLEAN | Ketersediaan       |

### product_modifiers

| Column     | Type    | Description   |
| ---------- | ------- | ------------- |
| product_id | UUID FK | Produk        |
| group_id   | TEXT FK | Grup modifier |

---

## Transaction System

### transactions

| Column          | Type    | Description        |
| --------------- | ------- | ------------------ |
| id              | UUID PK |                    |
| branch_id       | UUID FK | Cabang             |
| customer_id     | UUID FK | Pelanggan          |
| cashier_id      | UUID FK | Kasir              |
| subtotal        | DECIMAL |                    |
| voucher_id      | UUID FK | Voucher applied    |
| discount_amount | DECIMAL |                    |
| tax             | DECIMAL |                    |
| total           | DECIMAL |                    |
| payment_method  | TEXT    | Tunai/QRIS/Piutang |

### transaction_details

| Column         | Type    | Description           |
| -------------- | ------- | --------------------- |
| id             | UUID PK |                       |
| transaction_id | UUID FK |                       |
| product_id     | UUID FK |                       |
| product_name   | TEXT    | Nama saat transaksi   |
| qty            | INTEGER |                       |
| price          | DECIMAL | Harga saat transaksi  |
| modifiers      | JSONB   | Modifier yang dipilih |

---

## Loyalty System

### vouchers

| Column        | Type      | Description        |
| ------------- | --------- | ------------------ |
| id            | UUID PK   |                    |
| branch_id     | UUID FK   | Cabang             |
| code          | TEXT      | Kode voucher       |
| discount_type | TEXT      | PERCENTAGE / FIXED |
| value         | DECIMAL   | Nilai diskon       |
| expires_at    | TIMESTAMP | Tanggal kadaluarsa |

### customer_points

| Column       | Type       | Description |
| ------------ | ---------- | ----------- |
| user_id      | UUID FK UK | Pelanggan   |
| total_points | INTEGER    | Total poin  |

---

## Email Logging

### email_logs

| Column        | Type      | Description      |
| ------------- | --------- | ---------------- |
| id            | UUID PK   |                  |
| recipient     | TEXT      | Email tujuan     |
| subject       | TEXT      | Subjek email     |
| status        | TEXT      | SUCCESS / FAILED |
| error_message | TEXT      | Pesan error      |
| sent_at       | TIMESTAMP | Waktu kirim      |

---

## Referensi SQL

File lengkap: `docs/supabase_migration.sql`

Jalankan di **Supabase SQL Editor** untuk membuat semua tabel, index, RLS policies, dan triggers.
