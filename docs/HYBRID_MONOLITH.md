# Hybrid Monolith Restructuring Plan

This document outlines the strategy for the "Hybrid Monolith" architecture used in Zencode POS.

## 1. Concept

A **Hybrid Monolith** refers to a single Next.js codebase that serves multiple distinct user interfaces and experiences based on the target device or user role.

- **Desktop (Admin/Staff)**: A traditional dashboard experience using Selia UI.
- **Mobile (Customer)**: An app-like experience using Konsta UI, optimized for touch and standalone PWA usage.

## 2. Directory Structure Restructuring

The project was restructured to isolate these experiences within route groups:

```
src/app/
├── (admin)/      # Dashboard group (Desktop)
│   ├── layout.tsx
│   └── admin/    # /admin routes
└── (customer)/   # Mobile App group
    ├── layout.tsx
    └── app/      # /app routes
```

### Benefits:

- **Layout Separation**: Each group has its own root layout, allowing different global styles and component providers (e.g., Konsta vs Selia).
- **Code Sharing**: Utilities, hooks, and contexts (like `AuthContext`) are shared across both interfaces.
- **Simplified Deployment**: One build, one deployment URL, multiple experiences.

## 3. Device-Based Routing

The root page (`src/app/page.tsx`) acts as a smart gateway:

- **Mobile Edge Case**: Redirects to `/app` or `/login` if a mobile user agent is detected (or simple link navigation).
- **Desktop Edge Case**: Redirects to `/admin` or `/desktop-login`.

## 4. Context & State Isolation

- **CartContext**: Primarily used in the `/app` flow but logic is preserved for potential desktop usage.
- **AuthContext**: Centralized logic for role-checking (`isSuperAdmin`, `isCustomer`) to ensure users land on the correct interface.

---

_Reference: Implementation verified and completed on January 1, 2026._
