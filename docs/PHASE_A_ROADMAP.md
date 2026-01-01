# Phase A - Critical Commerce Flow Roadmap

> **Last Updated:** December 30, 2024
> **Status:** In Progress

---

## 📊 Current State (Verified)

### ✅ Working

- **Admin Dashboard**: Loads correctly with MetricsCards, SalesChart, RecentOrders
- **Authentication**: Login/logout works
- **Database**: Connected and responding
- **Basic Layout**: Headers, navigation, footers present

### ⚠️ Issues Found

- **Cart Page**: Placeholder only (`<p>Cart Page</p>`)
- **Collections Page**: Placeholder only (`<p>Collections Page</p>`)
- **Header**: Doesn't reflect login state (shows "Sign in" after login)
- **Homepage**: Categories section empty (needs data or products)
- **No Cart Icon**: Header missing cart functionality

### 📸 Screenshots

- Dashboard: Works correctly (zero data expected for new setup)
- Cart: Just text placeholder
- Collections: Just text placeholder

---

## 🎯 Sprint Breakdown

### Sprint 1: Cart Backend + Minor Fixes (3-4 days)

**Goal:** Create the backend infrastructure for cart operations

| #   | Task                             | File                                                      | Priority |
| --- | -------------------------------- | --------------------------------------------------------- | -------- |
| 1   | Create cart repository interface | `domain/interfaces/cart.repository.interface.ts`          | HIGH     |
| 2   | Create add-to-cart use case      | `application/use-cases/cart/add-to-cart.use-case.ts`      | HIGH     |
| 3   | Create get-cart use case         | `application/use-cases/cart/get-cart.use-case.ts`         | HIGH     |
| 4   | Create update-cart-item use case | `application/use-cases/cart/update-cart-item.use-case.ts` | HIGH     |
| 5   | Create remove-cart-item use case | `application/use-cases/cart/remove-cart-item.use-case.ts` | HIGH     |
| 6   | Create clear-cart use case       | `application/use-cases/cart/clear-cart.use-case.ts`       | MEDIUM   |
| 7   | Add cart to DI container         | `application/container.ts`                                | HIGH     |
| 8   | Create cart tRPC router          | `server/routers/public/cart.ts`                           | HIGH     |
| 9   | Fix header login state           | `components/layout/Header.tsx`                            | MEDIUM   |

**Exit Criteria:**

- [ ] Cart API endpoints respond correctly
- [ ] Can add/get/update/remove items via API
- [ ] Header shows user state after login

---

### Sprint 2: Cart UI (4-5 days)

**Goal:** Build customer-facing cart experience

| #   | Task                         | File                                      | Priority |
| --- | ---------------------------- | ----------------------------------------- | -------- |
| 1   | Create Zustand cart store    | `lib/stores/cart-store.ts`                | HIGH     |
| 2   | Create CartProvider          | `components/providers/cart-provider.tsx`  | HIGH     |
| 3   | Create CartDrawer            | `components/cart/CartDrawer.tsx`          | HIGH     |
| 4   | Create CartItem component    | `components/cart/CartItem.tsx`            | HIGH     |
| 5   | Create CartSummary component | `components/cart/CartSummary.tsx`         | HIGH     |
| 6   | Update cart page             | `app/(main)/cart/page.tsx`                | HIGH     |
| 7   | Add cart icon to header      | `components/layout/Header.tsx`            | HIGH     |
| 8   | Create AddToCartButton       | `components/products/AddToCartButton.tsx` | HIGH     |

**Exit Criteria:**

- [ ] Users can add products to cart from product pages
- [ ] Cart drawer slides out showing items
- [ ] Cart page shows full cart with quantities
- [ ] Cart persists in localStorage

---

### Sprint 3: Checkout + Stripe (5-7 days)

**Prerequisites:**

- Stripe account (test mode)
- API keys configured in `.env`

| #   | Task                        | Priority |
| --- | --------------------------- | -------- |
| 1   | Install Stripe packages     | HIGH     |
| 2   | Create Stripe service       | HIGH     |
| 3   | Create checkout use cases   | HIGH     |
| 4   | Create checkout tRPC router | HIGH     |
| 5   | Create Stripe webhook route | HIGH     |
| 6   | Build checkout page UI      | HIGH     |
| 7   | Build StripePaymentForm     | HIGH     |
| 8   | Build OrderSuccess page     | HIGH     |

**Exit Criteria:**

- [ ] Users can complete checkout with Stripe test cards
- [ ] Orders are created in database with correct status
- [ ] Payment records are saved

---

### Sprint 4: Order Emails (2-3 days)

| #   | Task                                  | Priority |
| --- | ------------------------------------- | -------- |
| 1   | Verify Resend API key                 | HIGH     |
| 2   | Connect email to payment confirmation | HIGH     |
| 3   | Test email delivery                   | HIGH     |
| 4   | Add shipping notification email       | MEDIUM   |

**Exit Criteria:**

- [ ] Order confirmation email sent within 30 seconds of payment
- [ ] Email contains order details and link

---

## 🚀 Getting Started

### Immediate Next Step

**Start Sprint 1, Task 1:** Create the cart repository interface

```bash
# Required files to create (in order):
1. src/domain/interfaces/cart.repository.interface.ts
2. src/application/use-cases/cart/add-to-cart.use-case.ts
3. src/application/use-cases/cart/get-cart.use-case.ts
...
```

### Before Starting Sprints 3-4

You'll need:

```env
# Stripe (get from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (existing - verify it's set)
RESEND_API_KEY=re_...
```

---

## 📝 Notes

- The existing cart repository (`DrizzleCartRepository`) exists but use cases are not wired up
- Dashboard is working fine - no fixes needed (A1 complete ✅)
- Focus on cart functionality first, then checkout
