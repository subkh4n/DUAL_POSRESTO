# Walkthrough - Hybrid Monolith Implementation

I have successfully restructured the project into a "Hybrid Monolith" architecture. The application now serves two distinct interfaces from a single codebase, using Next.js route groups and targeted UI libraries.

## Changes Made

### 1. Route Group Refactoring

- Renamed `(dashboard)` to `(admin)` for better clarity.
- Renamed `(mobile)` to `(customer)` to align with the user role.
- Moved mobile routes under `/app` to separate them from the root/admin namespace.

### 2. Dual Interface Routing

The application now exposes the following routes:

- **Admin (POS/Dashboard):**
  - `/admin` - Main Dashboard
  - `/admin/pos` - Cashier Interface
- **Customer (Mobile App):**
  - `/app` - Menu/Home
  - `/app/cart` - Shopping Cart

### 3. UI Libraries Integration

- **Admin:** Uses the "Selia" dashboard components (Shadcn style) for a desktop-optimized experience.
- **Customer:** Uses **Konsta UI** to provide a native iOS/Android feel for mobile users.

### 4. Root Landing Page

- Created a premium landing page at `/` that serves as the gateway for the entire system.
- Featured two clear calls to action: "Order Sekarang" (Customer) and "Kelola Resto" (Admin).
- Implemented responsive design with modern Tailwind CSS gradients and animations.

### 5. Mobile & Auth Enhancements

- **Auto-Redirect**: Ditambahkan deteksi perangkat di rute root (`/`). Jika pengguna mengakses lewat HP, mereka otomatis diarahkan ke `/app`.
- **Customer Login**: Membuat halaman login khusus pelanggan di `/login` menggunakan **Konsta UI** untuk kenyamanan akses mobile.

### 6. Data Persistence (LocalStorage)

- **CartContext**: Mengelola keranjang belanja yang sinkron dengan `localStorage`. Menambahkan fitur "Tambah ke Keranjang" yang persisten meskipun halaman di-refresh.
- **AuthContext**: Mengelola sesi login pelanggan yang persisten di `localStorage`.
- **Global Provider**: Membungkus rute `(customer)` dengan Provider tersebut untuk menjamin ketersediaan data secara global di sisi pelanggan.

### 7. Supabase Integration (Realtime & Serverless)

- **Singleton Client**: Setup `src/lib/supabase.ts` untuk koneksi terpusat.
- **Realtime Orders Hook**: Implementasi `useRealtimeOrders` yang mendengarkan `INSERT/UPDATE` pada tabel `orders` secara langsung tanpa backend server tambahan.
- **Architecture Shift**: Beralih dari polling tradisional ke event-driven menggunakan Supabase Realtime.

### 8. Advanced Features (Vouchers, Points, & Branches)

- **Multi-Branch Context**: Implementasi `BranchContext` yang mengisolasi data voucher dan pesanan berdasarkan cabang yang dipilih.
- **Admin Voucher Management**: Halaman khusus di Dashboard Admin untuk membuat dan mengelola promo per cabang.
- **Customer Rewards**: Halaman "Hadiah & Poin" di aplikasi mobile yang menampilkan akumulasi poin dan voucher tersedia.
- **Product Management Roles**: Memisahkan hak akses antara **Admin Pusat** (Upload/Edit global) dan **Branch Admin** (Kontrol ketersediaan/status aktif).

## Verification Results

### Automated Build

The production build was successful, verifying all routes and role logic:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/pos
├ ○ /admin/products
├ ○ /admin/vouchers
├ ○ /app
├ ○ /app/cart
├ ○ /app/rewards
└ ○ /login
```

### Route Integrity

- Verified `/admin` sidebar links.
- Verified `/app` internal navigation (Link to `/app/cart`).
