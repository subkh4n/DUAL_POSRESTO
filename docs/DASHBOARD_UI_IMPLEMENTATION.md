# Dashboard UI Implementation Guide

This document covers the implementation details of the Zencode POS Admin Dashboard.

## 1. Design Philosophy

- **Style**: Minimalist, professional, and data-driven.
- **Components**: Derived from the **Selia UI** component library.
- **Layout**: Sidebar-based navigation with a responsive main content area.

## 2. Key Components

### Stat Cards

Located in `src/components/dashboard/stat-card.tsx`.

- Displays key performance indicators (KPIs) like Total Sales, Orders, and Revenue.
- Includes dynamic change indicators (percentage increase/decrease).
- Uses `formatIDR` for currency consistency.

### Sales Chart

Located in `src/components/dashboard/sales-chart.tsx`.

- Visualizes sales data over time using a line/area chart.
- Integrated with standard number formatting for Y-axis labels.

### App Sidebar

Located in `src/components/dashboard/app-sidebar.tsx`.

- Branded with the Zencode logo and company name.
- Role-based menu items (TODO: Implement visibility filters based on role).

## 3. Page Implementations

### Main Dashboard (`/admin`)

- Overview of business health.
- Quick stats, sales trends, and recent transaction summaries.
- List of best-selling products.

### POS / Cashier (`/admin/pos`)

- High-efficiency interface for rapid order entry.
- Product grid with category filtering.
- Integrated **Product Modifiers** modal.
- Real-time cart calculation and Supabase transaction sync.

## 4. Branding Standardization

- **Font**: Lucide Icons for all UI elements.
- **Colors**: Slate/Zinc palette for a professional software house aesthetic.
- **Currency**: All monetary values must use `formatIDR(value, true)` for consistency.
