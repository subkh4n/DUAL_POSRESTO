# Email Monitoring Dashboard

> **Status**: ✅ Selesai

Fitur untuk memberikan transparansi kepada Admin mengenai status pengiriman email (Notifikasi Order, Reset Password, dll) langsung dari dalam aplikasi.

## Database Schema

Tabel `email_logs` sudah ditambahkan ke `supabase_migration.sql`:

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED')),
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);
```

## Backend Logic

File `src/app/api/send-email/route.ts` sudah dimodifikasi untuk:

- Mencatat SUCCESS setelah email berhasil terkirim
- Mencatat FAILED beserta `error_message` jika gagal

## Admin UI

Halaman `/admin/email-logs` menampilkan:

- Tabel riwayat pengiriman email
- Status (Success/Failed) dengan badge berwarna
- Detail error jika gagal
- Fitur search dan refresh

## Cara Akses

Menu **"Monitoring Email"** tersedia di sidebar Admin (kategori System).
