# App Analysis — Live Notes (rolling)

**Last updated:** 2026-01-13

This file is a rolling log of concrete findings while reading the app code. It is intentionally incremental.

## 0) Navigation

- Final consolidated summary: `docs/2026-01-13/FINAL-ANALYSIS-SUMMARY.md`
- Route matrix: `docs/2026-01-13/04-route-matrix.md`
- Broken links list: `docs/2026-01-13/13-broken-links-in-codebase.md`
- Public routers vs storefront usage: `docs/2026-01-13/14-public-routers-vs-storefront-pages.md`

## 1) High-signal findings

### 1.1 Root vs Route-Group layouts

- `src/app/layout.tsx` is a temporary simplified root layout.
- Providers/nav are in route-group layouts:
  - `(main)` wraps `TRPCProvider` + `CartProvider` and renders Navbar/Footer/CartDrawer.
  - `(admin)` wraps `TRPCProvider` and renders AdminSidebar/AdminHeader.
  - `(auth)` is a simple centered layout.

### 1.2 Middleware route protection

- `src/middleware.ts` protects only:
  - `/dashboard/:path*`
  - `/orders/:path*`

### 1.3 Admin routing collision

- Admin products are currently at `/products` and `/products/new`.
- Public product detail is `/products/[slug]`.

This is a collision and also creates protection gaps (middleware does not protect `/products/*`).

## 2) Storefront routes state

- `/products/[slug]` is mock-backed (not using `public.products.getBySlug`).
- `/collections/*` pages are mock-backed; `/collections` index is a stub.
- `/search` is a stub.
- `/wishlist` is wired to protected tRPC.
- `/account/*` is wired to protected tRPC.

## 3) Checkout & orders

- `/checkout` page is empty but cart UI links to it.
- Stripe checkout session creation exists (tRPC + use case).
- Stripe webhook verifies signature + sends email, but **does not create DB orders/payments**.
- Order creation is blocked by:
  - `DrizzleOrderRepository.create()` not implemented
  - no `CreateOrderUseCase`
  - status taxonomy drift across DB/admin/UI

## 4) CMS/settings subsystem

- Admin settings router is comprehensive (site settings, sections, history, featured items).
- Drizzle site config repo is implemented.
- Storefront consumes CMS through server components + `unstable_cache`.
- No `revalidateTag`/`revalidatePath` found → 60s cache delay.

## 5) Dead links / missing routes

- Footer links to many missing public pages (see doc 10 + doc 13).
- Mobile menu links to missing collections routes.
- Admin sidebar links to many missing admin pages.
- `UserDialog` links to missing/wrong routes.

## 6) Status

This review pass is considered **complete** for: navigation surfaces, public router coverage vs storefront usage, checkout/order persistence blockers, CMS/settings subsystem, and route collision/protection issues.

Next work is implementation planning and execution (fix routes, wire storefront to public routers, implement checkout+order persistence).
