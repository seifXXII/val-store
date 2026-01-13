# Enhancements & Recommendations

**Review date:** 2026-01-13

This is a prioritized list of improvements focused on shipping a reliable store, then scaling quality.

## 1) Delivery / Feature completion (highest ROI)

### A) Finish the commerce loop

- **Cart**
  - Decide the source of truth: DB cart for authed users + local fallback for guests.
  - Add stock validation at “add to cart” and again at checkout.

- **Checkout**
  - Use a multi-step flow with persisted draft order state.
  - Make the server compute totals and apply discounts.

- **Stripe**
  - PaymentIntent creation in server layer.
  - Webhook handling to update `orders` + `payments` tables.

- **Emails**
  - Order receipt email (Resend). Keep templates versioned.

## 2) Testing strategy (add confidence)

### A) Unit tests (start here)

- Domain entities: product pricing, order state transitions, discount calculations.
- Value objects and exceptions.

### B) Integration tests

- tRPC routers with in-memory DB or test DB container.
- Repositories: CRUD + transactional behaviors.

### C) E2E tests

- Playwright: “browse → add to cart → checkout → webhook simulated → success page”.

## 3) CI/CD + release hygiene

- Add a CI pipeline to run:
  - `pnpm lint`
  - `pnpm type-check`
  - tests
- Add “required checks” before merging.
- Add a release checklist (migrations, env vars, webhook secrets).

## 4) Security hardening

- Rate limiting on:
  - login/signup
  - password reset
  - checkout/payment endpoints
- Security headers baseline.
- Upload validation (file type/size) if using UploadThing.
- Audit dependencies periodically.

## 5) Performance & scalability

- Move search to DB (full-text/trigram).
- Add caching for catalog pages (products/categories).
- Be deliberate with server vs client components; avoid unnecessary client boundaries.

## 6) Developer experience

- Replace default root README with a real one.
- Ensure `.env.example` exists (no secrets) + env validation.
- Consider enforcing formatting via CI (Prettier) not only git hooks.

## 7) Product/UX improvements

- Better error handling and error boundaries.
- Empty states for cart/wishlist/search.
- SEO: metadata per product/category, sitemap, robots.
