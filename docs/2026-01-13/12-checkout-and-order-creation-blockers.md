# Checkout & Order Creation Blockers (Critical Path)

**Last updated:** 2026-01-13

This doc focuses specifically on the blockers preventing a real end-to-end commerce flow:

`cart → checkout → payment → webhook → order persisted → visible in account/admin`.

## 1) Primary blocker: order creation is not implemented in the repository

- File: `src/infrastructure/database/repositories/order.repository.ts`
- Method: `DrizzleOrderRepository.create()`
- Current behavior: **throws an error**:

> "Order creation not implemented - schema mapping needs address IDs"

**Impact:**

- No code path can successfully persist orders through the repository abstraction.
- Customer account pages that rely on DB orders will remain empty.
- Admin dashboard metrics and recent orders will remain empty/inaccurate.

## 2) Stripe webhook does not persist orders

- File: `src/app/api/webhook/stripe/route.ts`
- Handles `checkout.session.completed`:
  - Sends confirmation email (Resend)
  - Attempts to clear cart in DB
  - Does **not** create an order in `orders` + `order_items` tables

Even if you add order creation here, it will fail until `OrderRepository.create()` (or an equivalent use case) is implemented.

## 3) Checkout session metadata mismatch

- Checkout session creation:
  - File: `src/application/use-cases/checkout/create-checkout-session.use-case.ts`
  - Sets Stripe metadata: `{ orderId: tempOrderId }`

- Webhook cart clearing logic expects:
  - `metadata.userId`

**Impact:** cart clearing in webhook will not run unless you add `userId` to Stripe metadata.

## 4) Missing `/checkout` page

- UI links to `/checkout` (cart summary + cart drawer)
- File `src/app/(main)/checkout/page.tsx` is empty.

**Impact:** users cannot initiate Stripe checkout from the UI.

## 5) Status taxonomy drift (admin vs domain vs DB)

Multiple places use different status values:

- **DB enum `order_status`**: `pending`, `processing`, **`paid`**, `shipped`, `delivered`, `cancelled`, `refunded`
- **Admin router schema**: `pending`, **`confirmed`**, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`
- **Admin UI types**: `pending`, `processing`, **`paid`**, `shipped`, `delivered`, `cancelled`, `refunded`

**Impact:**

- `confirmed` status in admin router will fail DB insert.
- Dashboards/filters/badges can disagree.

## 6) What needs to exist for order creation

Based on the repository comment and `src/db/schema.ts`, order creation requires:

- `orders` table:
  - `orderNumber` (required, unique)
  - `subtotal` (required)
  - `totalAmount` (required)
  - `shippingAddressId` / `billingAddressId` (nullable, but repo comment implies they are needed)

- `orderItems` table (for each item):
  - `orderId`
  - `productName`
  - `quantity`
  - `unitPrice`
  - `totalPrice`

## 7) Missing `CreateOrderUseCase`

- A search for `create*order*.ts` under `src/application/use-cases` returned **0 results**.
- This confirms there is no use case to orchestrate order creation from cart/session data.

## 8) Recommended investigation items (next)

- Determine whether the intended design is:
  - create a “pending” order before Stripe redirect, then mark paid in webhook
  - or create order only after successful webhook event
