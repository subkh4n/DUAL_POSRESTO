# Dual UI Architecture - Implementation Plan

## Overview

Project ini mengimplementasikan arsitektur **Dual UI** dalam satu aplikasi Next.js:

- **Konsta UI** untuk antarmuka mobile (customer-facing PWA)
- **Selia UI** untuk dashboard admin/kasir

## Technology Stack

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| Next.js 16      | Framework dengan App Router |
| TypeScript      | Type safety                 |
| Tailwind CSS v4 | Styling                     |
| Konsta UI       | Mobile UI components        |
| Selia UI        | Dashboard components        |
| Lucide React    | Icons                       |

## Project Structure

```
src/
├── app/
│   ├── (mobile)/              ← Route group untuk Konsta UI
│   │   ├── layout.tsx         ← Konsta App wrapper
│   │   ├── page.tsx           ← Mobile menu
│   │   └── cart/page.tsx      ← Cart page
│   │
│   ├── (dashboard)/           ← Route group untuk Selia UI
│   │   ├── layout.tsx         ← Dashboard layout + Selia Sidebar
│   │   └── admin/
│   │       ├── page.tsx       ← Dashboard dengan StatCards
│   │       └── pos/page.tsx   ← POS page
│   │
│   ├── globals.css            ← Unified theme variables
│   └── layout.tsx             ← Root layout
│
├── components/
│   ├── selia/                 ← Selia UI components
│   │   ├── sidebar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── input.tsx
│   │   └── separator.tsx
│   │
│   └── dashboard/             ← Dashboard-specific blocks
│       ├── app-sidebar.tsx    ← Navigation sidebar
│       └── stat-card.tsx      ← Statistics card
│
└── lib/
    └── utils.ts               ← cn() utility function
```

## Route Groups

### Mobile Routes `(mobile)/`

- `/` - Home page dengan menu list
- `/cart` - Shopping cart

### Dashboard Routes `(dashboard)/`

- `/admin` - Dashboard overview
- `/admin/pos` - Point of Sale
- `/admin/products` - Products management (placeholder)
- `/admin/customers` - Customers (placeholder)
- `/admin/settings` - Settings (placeholder)

## CSS Theme Variables

File `globals.css` mendefinisikan unified theme variables:

```css
:root {
  --primary: #007aff;
  --secondary: #f4f4f5;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --muted: #71717a;
  /* ... */
}
```

## Adding New Selia Components

```bash
npx selia@latest add [component-name]
```

Available components: https://selia.nauv.al/docs/alert

## Installation Steps

1. Create Next.js project with Tailwind CSS
2. Install Konsta UI: `npm install konsta`
3. Initialize Selia: `npx selia@latest init`
4. Add Selia components as needed
5. Configure `globals.css` with theme variables
6. Create route groups and layouts
