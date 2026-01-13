# Decisions & Next Plan (No Coding)

**Date:** 2026-01-13

This document records the decisions you made after the analysis and translates them into a clear next plan for future implementation.

## 1) Decisions

### 1.1 Admin URL structure

- **Decision:** Use `/admin/*` as the canonical admin prefix.

**Implications:**

- All admin routes should move from mixed locations (`/dashboard`, `/orders`, `/products`) to a single namespace:
  - `/admin`
  - `/admin/orders`
  - `/admin/orders/[id]`
  - `/admin/products`
  - `/admin/products/new`
  - `/admin/products/[id]`
  - `/admin/settings`
  - plus future: `/admin/inventory`, `/admin/customers`, `/admin/reviews`, `/admin/coupons`, `/admin/analytics`

- Middleware protection should target `/admin/:path*`.

- All admin UI links should be updated to use `/admin/*`.

## 2) Order creation strategy

### 2.1 Decision

- **Decision:** Create an order _before payment_ (a “pending order”) and then update the order based on payment outcome.

### 2.2 Why this is preferred (your reason)

- You want support for **Cash on Delivery**.
  - COD orders must exist even when no Stripe payment occurs.

### 2.3 Recommended state machine (high level)

- `pending`
  - created when customer confirms checkout (before payment)
- `paid`
  - set when Stripe webhook confirms successful payment
- `processing` / `shipped` / `delivered`
  - admin workflow
- `cancelled` / `refunded`
  - admin workflow

**Important:** remove any non-DB status like `confirmed` (DB enum does not include it).

## 3) Practical implementation outline (for later)

### 3.1 Checkout (pending order) flow

1. Customer proceeds to checkout.
2. Server creates:
   - `orders` record (status `pending`)
   - `order_items` records
   - (optional) `payments` record with `payment_status = pending`
3. If payment method is Stripe:
   - Create Stripe session / PaymentIntent
   - Put `orderId` and `userId` in Stripe metadata
4. Redirect user to Stripe (if Stripe payment).

### 3.2 Webhook flow

On `checkout.session.completed`:

- Verify signature.
- Resolve `orderId` from Stripe metadata.
- Mark order `paid`.
- Insert/update `payments` row:
  - `transactionId = session.id` (or payment intent id)
  - `paymentStatus = completed`
- Clear cart for user.

### 3.3 COD flow

- Create order with `pending`.
- No Stripe call.
- Admin fulfills order and updates statuses.

## 4) Known blockers from analysis that must be addressed later

- `DrizzleOrderRepository.create()` is not implemented.
- No `CreateOrderUseCase` exists.
- `/checkout` page is empty.
- Several UI links currently point to missing routes (`/auth/login`, `/settings`, `/dashboard`, etc.).

## 5) Docs to reference

- `FINAL-ANALYSIS-SUMMARY.md`
- `12-checkout-and-order-creation-blockers.md`
- `07-admin-routing-issues.md`
- `13-broken-links-in-codebase.md`
- `14-public-routers-vs-storefront-pages.md`
