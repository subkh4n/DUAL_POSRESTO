# Panduan Implementasi Brevo Email Service

Dokumen ini menjelaskan cara kerja dan konfigurasi pengiriman email transactional (Notifikasi Order & Reset Password) menggunakan Brevo di aplikasi **Fore Coffee Clone**.

## 1. Dapatkan API Key (v3)

Aplikasi kita menggunakan **API v3** untuk mengirim email transactional.

1. Login ke [Brevo Dashboard](https://app.brevo.com/).
2. Klik nama akun Anda di pojok kanan atas, lalu pilih **"SMTP & API"**.
3. Pilih tab **"API Keys"**.
4. Klik tombol **"Generate a new API key"**.
5. Beri nama (misal: `RestoApp_Dev`), lalu salin kodenya.
6. Masukkan kode tersebut ke file [`.env.local`](file:///d:/PROJECT/DUAL_POSRESTO/.env.local) pada variabel `BREVO_API_KEY`.

## 2. Verifikasi Pengirim (Sender & Domain)

Brevo tidak akan mengirim email jika email pengirimnya belum diverifikasi.

1. Di dashboard Brevo, buka menu **"Senders & IP"** (biasanya ada di bawah menu profile).
2. Pilih tab **"Senders"**.
3. Klik **"Add a sender"**.
4. Masukkan **Nama** dan **Email** yang ingin Anda gunakan (misal: `admin@domainanda.com`).
5. Cek kotak masuk email tersebut dan klik tautan verifikasi dari Brevo.
6. Masukkan email yang sudah terverifikasi ini ke [`.env.local`](file:///d:/PROJECT/DUAL_POSRESTO/.env.local) pada variabel `SENDER_EMAIL`.

## 3. Cara Kerja di Kode (Opsional)

Dalam kode yang saya buat, Anda **tidak perlu** membuat template di dashboard Brevo karena:

- **HTML Template** sudah saya tanam langsung di file [`src/lib/email.ts`](file:///d:/PROJECT/DUAL_POSRESTO/src/lib/email.ts).
- Aplikasi mengirimkan isi email (Body HTML) secara dinamis setiap kali ada transaksi.
- Ini memudahkan Anda merubah desain email langsung dari Visual Studio Code tanpa harus bolak-balik ke dashboard Brevo.

## 4. Laporan Order di Dashboard Brevo

Jika Anda ingin melihat siapa saja yang menerima email atau apakah emailnya masuk ke folder spam:

1. Buka menu **"Transactional"** di Brevo.
2. Pilih **"Statistics"** atau **"Logs"**.
3. Di sana Anda bisa melihat daftar email yang terkirim, dibuka (_opened_), atau diklik oleh pelanggan.

---

> [!TIP] > **Penting untuk Testing:**
> Jika Anda masih menggunakan akun Brevo gratis (Free Plan), Anda memiliki kuota **300 email per hari**. Pastikan Anda selalui mengisi `BREVO_API_KEY` dan `SENDER_EMAIL` yang valid di `.env.local` agar tidak muncul error "Gagal kirim email".

## Lampiran: Konfigurasi Environment (`.env.local`)

```env
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxx
SENDER_EMAIL=admin@domainanda.com
SENDER_NAME="Fore Coffee Admin"
```

## Troubleshooting

- **Error 401 (Unauthorized)**: API Key salah atau belum dimasukkan ke `.env.local`.
- **Error 400 (Bad Request)**: Email pengirim (`SENDER_EMAIL`) belum diverifikasi di dashboard Brevo.
- **Email tidak masuk**: Cek folder Spam atau Quota harian di dashboard Brevo (Limit 300 email/hari untuk paket gratis).
