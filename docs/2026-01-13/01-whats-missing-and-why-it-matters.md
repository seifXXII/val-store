# What's Missing (and why it matters)

**Review date:** 2026-01-13

This repo already has strong architecture and planning docs, but the **missing pieces are mostly “delivery + hardening”**.

## P0 — Missing pieces that block a real store

### 1) Cart → Checkout → Payment is not fully end-to-end

- **Why it matters**
  - This is the revenue path. Without it, the project can’t be validated in production.

- **What to add**
  - A true cart model (guest + signed-in)
  - Checkout wizard (shipping + payment)
  - Stripe PaymentIntent creation
  - Stripe webhook handler to finalize orders
  - Order confirmation email

### 2) Order lifecycle and integrity enforcement

- **Why it matters**
  - You must guarantee totals are consistent, inventory can’t go negative, and status transitions are valid.

- **What to add**
  - Server-side recalculation of totals on order creation
  - Transactional updates (order + items + inventory) where needed
  - Explicit order state machine checks in use cases

## P0 — Missing engineering controls

### 3) Tests (unit + integration + E2E)

- **Why it matters**
  - This project will grow. Without tests you’ll hesitate to change anything.

- **What to add first**
  - Unit tests for `domain/entities` (pure logic)
  - Integration tests for key tRPC routers
  - One E2E test: “checkout completes”

### 4) CI (automation)

- **Why it matters**
  - Prevents broken `main` and enforces baseline quality.

- **What to add**
  - GitHub Actions workflow running:
    - `pnpm lint`
    - `pnpm type-check`
    - tests

### 5) Production security baseline

- **Why it matters**
  - Auth endpoints are common attack targets.

- **What to add**
  - Rate limiting for auth + checkout endpoints
  - Security headers (HSTS, frame, nosniff, referrer policy)
  - Consider CSP once you finalize third-party scripts

## P1 — Missing product features (important but not blocking)

- **Account area**
  - Order history, address book, profile management.

- **Wishlist**
  - DB table exists; finish repository + routers + UI.

- **Coupons**
  - Schema exists; implement validation + application at checkout.

- **Reviews**
  - Add entity/repo/router + moderation.

## P2 — Quality and scalability

- **Search**
  - Replace in-memory filtering with DB-backed search (full-text or trigram) and proper indexes.

- **Observability**
  - Structured logging, request IDs, error reporting.

- **Performance**
  - Cache strategy for catalog pages; evaluate RSC boundaries.
