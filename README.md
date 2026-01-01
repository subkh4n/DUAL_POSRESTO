# Zencode POS 🚀

**Zencode POS** is a premium, professional-grade Point of Sale (POS) system designed by **Zencode (Professional Software House)**. It features a hybrid architecture that seamlessly integrates a powerful desktop-optimized admin dashboard with a sleek, mobile-first customer ordering application.

## ✨ Key Features

- **Hybrid Monolith Architecture**: One codebase, two specialized interfaces.
- **Role-Based Access Control (RBAC)**: secure access for `superadmin`, `admin`, `cashier`, and `customer`.
- **Progressive Web App (PWA)**: Installable, offline-ready, and mobile-optimized.
- **Multi-Branch Support**: Isolate and manage data across multiple business locations.
- **Product Modifier System**: Custom options (toppings, sizes, levels) with price adjustments.
- **Loyalty & Rewards**: Integrated voucher system and automated customer points.
- **Real-time Notifications**: Order confirmations and security alerts via transactional email (Brevo).
- **Global Ready**: Full English translation and Indonesian IDR number formatting.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS v4, Lucide Icons.
- **UI Kits**: Selia (Admin Dashboard), Konsta UI (Mobile App).
- **Backend/DB**: Supabase (PostgreSQL + Realtime).
- **Communication**: Brevo (SMTP/Transactional API).
- **Deployment**: Vercel.

## 🚀 Getting Started

1. **Clone & Install**:

   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Supabase Setup**:

   - Run `docs/supabase_migration.sql` in Supabase SQL Editor.
   - Run `docs/sql/create_test_users.sql` to initialize roles and staff accounts.

3. **Environment Variables**:
   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   BREVO_API_KEY=your_key
   ```

4. **Development**:
   ```bash
   npm run dev
   ```

## 📖 Documentation

Detailed documentation can be found in the `/docs` directory:

- [System Walkthrough](docs/WALKTHROUGH.md)
- [Implementation Plan](docs/implementation_plan.md)
- [Development Log](docs/DEVELOPMENT_LOG.md)
- [Task Checklist](docs/task.md)

---

© 2026 Zencode (Professional Software House). All rights reserved.
