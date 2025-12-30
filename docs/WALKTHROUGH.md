# Dual UI Architecture - Walkthrough

## Project Overview

Aplikasi **RestoApp** menggunakan arsitektur dual UI:

- **Konsta UI** - Mobile PWA untuk pelanggan
- **Selia UI** - Dashboard untuk admin/kasir

## Demo

### Mobile Interface (Konsta UI)

| Route   | Deskripsi                                 |
| ------- | ----------------------------------------- |
| `/`     | Menu makanan dengan list items            |
| `/cart` | Keranjang belanja dengan quantity control |

### Dashboard Interface (Selia UI)

| Route        | Deskripsi                                     |
| ------------ | --------------------------------------------- |
| `/admin`     | Dashboard dengan stat cards dan recent orders |
| `/admin/pos` | Point of Sale dengan mixed Konsta + Selia     |

## Key Components

### Selia Sidebar

File: `src/components/dashboard/app-sidebar.tsx`

Sidebar navigasi menggunakan komponen Selia:

- `Sidebar`, `SidebarHeader`, `SidebarContent`
- `SidebarMenu`, `SidebarList`, `SidebarItem`
- Icons dari Lucide React (HomeIcon, ShoppingBagIcon, etc.)

### Stat Cards

File: `src/components/dashboard/stat-card.tsx`

Kartu statistik dengan:

- Title, value, percentage change
- Trend indicator (up/down)
- Icon dengan background

### Theme System

File `src/app/globals.css` menyatukan theme untuk kedua library:

```css
:root {
  --primary: #007aff;
  --primary-foreground: #ffffff;
  --success: #22c55e;
  --danger: #ef4444;
  /* ... */
}

@theme inline {
  --color-primary: var(--primary);
  --color-success: var(--success);
  /* ... */
}
```

## How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# Mobile: http://localhost:3000/
# Dashboard: http://localhost:3000/admin
```

## Adding More Components

### Selia Components

```bash
npx selia@latest add dialog
npx selia@latest add select
npx selia@latest add table
```

### Konsta Components

Import langsung dari `konsta/react`:

```tsx
import { Sheet, Popup, Dialog } from "konsta/react";
```

## Files Modified

| File                             | Changes                 |
| -------------------------------- | ----------------------- |
| `src/app/globals.css`            | Unified theme variables |
| `src/app/layout.tsx`             | Font configuration      |
| `src/app/(mobile)/layout.tsx`    | Konsta App wrapper      |
| `src/app/(dashboard)/layout.tsx` | Selia sidebar layout    |
| `src/components/selia/*`         | Selia UI components     |
| `src/components/dashboard/*`     | Dashboard blocks        |

## Notes

- Selia menggunakan Tailwind CSS v4 features (`@theme inline`)
- Icons menggunakan Lucide React dengan naming `*Icon` (HomeIcon, etc.)
- Size classes menggunakan `size-X` (Tailwind v4 shorthand)
