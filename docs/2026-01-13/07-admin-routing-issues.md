# Admin Routing Issues and Inconsistencies

**Last updated:** 2026-01-13

This document tracks all routing-related issues in the admin section, including broken links, route collisions, and protection gaps.

## 1) Route collisions

| Route Pattern                                           | Issue                           | Impact                                       | Recommended Fix                                      |
| ------------------------------------------------------- | ------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `/products` (admin list) vs `/products/[slug]` (public) | Admin and public routes collide | Routing ambiguity + broken storefront access | Move admin routes under `/dashboard/*` or `/admin/*` |

## 2) Missing admin detail routes (confirmed)

Search result: no dynamic routes exist under `src/app/(admin)/**/[id]`.

| Referenced in                                          | Links to                        | Expected location                        | Status  |
| ------------------------------------------------------ | ------------------------------- | ---------------------------------------- | ------- |
| `src/components/admin/products-list/ProductsTable.tsx` | `/admin/products/${product.id}` | `src/app/(admin)/products/[id]/page.tsx` | missing |
| `src/components/admin/orders-list/OrdersTable.tsx`     | `/orders/${order.id}`           | `src/app/(admin)/orders/[id]/page.tsx`   | missing |
| `src/components/admin/dashboard/RecentOrders.tsx`      | `/orders/${order.id}`           | `src/app/(admin)/orders/[id]/page.tsx`   | missing |

## 3) Middleware protection gaps (confirmed)

Middleware matcher in `src/middleware.ts` only protects:

- `/dashboard/:path*`
- `/orders/:path*`

But admin product routes are currently:

- `src/app/(admin)/products/page.tsx` → `/products`
- `src/app/(admin)/products/new/page.tsx` → `/products/new`

So `/products/*` is **not protected** by middleware.

## 4) Inconsistent paths / redirects

| Component                                                     | Path used                          | Intended                                | Issue                                 |
| ------------------------------------------------------------- | ---------------------------------- | --------------------------------------- | ------------------------------------- |
| `src/app/(main)/account/layout.tsx`                           | `/auth/login?callbackUrl=/account` | `/login?redirect=/account` (or similar) | Likely broken redirect                |
| `src/components/admin/create-product/CreateProductHeader.tsx` | `/products`                        | admin products list                     | Will need update if admin routes move |
| `src/components/admin/dashboard/RecentOrders.tsx`             | `/orders` and `/orders/[id]`       | admin orders list/detail                | Detail route missing                  |

## 5) Recommendations (preferred structure)

### Option A (recommended): `/dashboard/*`

- `/dashboard` (overview)
- `/dashboard/orders` (list)
- `/dashboard/orders/[id]` (detail)
- `/dashboard/products` (list)
- `/dashboard/products/new`
- `/dashboard/products/[id]` (edit/detail)
- `/dashboard/settings`

Update middleware matcher to protect `/dashboard/:path*` only.

### Option B: `/admin/*`

Same structure, but using `/admin/...` prefix.

## 6) Follow-ups

- Ensure admin routes use both:
  - edge middleware (session cookie presence)
  - server-side role checks (`adminProcedure` already exists)
- Fix all hardcoded links in admin UI to match final route structure.
