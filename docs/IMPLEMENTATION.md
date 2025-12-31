# Dual UI Architecture - Implementation

> **Update Terakhir**: 31 Desember 2024

Arsitektur **Dual UI** dalam satu aplikasi Next.js: Konsta UI untuk mobile, Selia UI untuk dashboard admin.

---

## Technology Stack

| Technology      | Purpose                    |
| --------------- | -------------------------- |
| Next.js 14      | App Router                 |
| TypeScript      | Type safety                |
| Tailwind CSS v4 | Styling                    |
| Konsta UI       | Mobile components          |
| Selia UI        | Dashboard components       |
| Supabase        | Database + Auth + Realtime |
| Brevo           | Transactional email        |

---

## Project Structure

```
src/
├── app/
│   ├── (customer)/              ← Route group Konsta UI
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── app/
│   │       ├── page.tsx         ← Menu
│   │       ├── cart/page.tsx    ← Keranjang
│   │       ├── rewards/page.tsx ← Poin & Voucher
│   │       └── splash/page.tsx  ← Splash screen
│   │
│   ├── (admin)/                 ← Route group Selia UI
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx         ← Dashboard
│   │       ├── pos/page.tsx     ← Kasir + Modifier
│   │       ├── products/page.tsx
│   │       ├── modifiers/page.tsx ← CRUD Modifier
│   │       ├── vouchers/page.tsx
│   │       ├── email-logs/page.tsx
│   │       └── ...
│   │
│   ├── api/
│   │   └── send-email/route.ts  ← Brevo API
│   │
│   ├── globals.css
│   └── page.tsx                 ← Landing page
│
├── components/
│   ├── selia/                   ← Dashboard components
│   └── dashboard/               ← App-specific blocks
│
├── context/
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── BranchContext.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── email.ts
│   └── utils.ts
│
└── hooks/
    └── useRealtimeOrders.ts
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
BREVO_API_KEY=xkeysib-xxx
SENDER_EMAIL=admin@domain.com
SENDER_NAME="App Name"
```

---

## Adding Components

**Selia UI:**

```bash
npx selia@latest add [component-name]
```

**Konsta UI:**
Import langsung dari `konsta/react`
