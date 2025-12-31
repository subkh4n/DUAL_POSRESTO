# Laporan Progres & Riwayat Implementasi

Laporan ini merangkum langkah-langkah pengembangan dari awal hingga akhir, termasuk kendala teknis dan solusinya.

## 1. Tahap Persiapan (Awal)

- **Migrasi Database**: Penyiapan skema Supabase untuk multi-branch (`branches`, `products`, `transactions`).
- **Setup UI**: Penyatuan Konsta UI (Mobile) dan Selia Components (Dashboard).

## 2. Implementasi Otentikasi

- **Masalah**: Login awalnya hanya menggunakan placeholder.
- **Solusi**: Integrasi Supabase Auth dengan Magic Link (Email) dan Google OAuth.
- **Kendala**: Muncul error `Context not found` pada Admin Dashboard.
- **Perbaikan**: Membungkus `AdminLayout` dengan `AuthProvider`.

## 3. Integrasi Email (Brevo)

- **Langkah**: Membuat API Route untuk menyembunyikan API Key Brevo.
- **Masalah**: Error pengiriman karena tipe data `items` berupa `any`.
- **Perbaikan**: Membuat Interface `OrderItem` untuk memastikan data yang dikirim ke template email selalu valid.

## 4. Fitur Password Reset

- **Langkah**: Membuat halaman `/forgot-password` dan `/reset-password`.
- **Masalah**: Pengguna bingung cara mendapatkan link reset.
- **Solusi**: Menambahkan notifikasi visual yang jelas setelah email terkirim dan fitur "Kembali ke Login".

## 5. Pembersihan Kode & Standarisasi (Terakhir)

- **Masalah**: Muncul banyak _Warning_ dari IDE terkait Tailwind CSS v4.
- **Perbaikan**:
  - Mengubah sintaks `!bg-green` menjadi `bg-green!`.
  - Menghapus properti ilegal seperti `size` pada komponen `Link` Next.js.
  - Menghapus import yang tidak terpakai (`unused imports`).

## Ringkasan Error & Solusi Penting

| Masalah                    | Penyebab                     | Solusi                                                                                             |
| :------------------------- | :--------------------------- | :------------------------------------------------------------------------------------------------- |
| `Unknown at rule @theme`   | Fitur baru Tailwind v4       | Diabaikan (False Positive) karena secara fungsional benar.                                         |
| `large` prop tidak dikenal | Mismatch dengan Selia Button | Diganti menjadi `size="lg"`.                                                                       |
| `any` type error           | Typescript Strict Mode       | Dibuatkan Interface khusus untuk data kompleks.                                                    |
| Checkout Gagal di Mobile   | `branch_id` kosong           | Ditambahkan placeholder UUID branch default dan pengambilan data branch otomatis dari user profil. |

## Status Saat Ini

- [x] Login (Magic Link & Google)
- [x] Keranjang & Checkout
- [x] Notifikasi Email Detail Belanja
- [x] Lupa Password & Reset Flow
- [x] Pembersihan Kode (Linting)
