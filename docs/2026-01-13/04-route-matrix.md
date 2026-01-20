# Route / Feature Matrix

**Last updated:** 2026-01-13

Legend:

- **Status**
  - `implemented` = page exists and has meaningful UI/logic
  - `implemented (mock)` = page exists but uses mock data / TODO to wire
  - `stub` = placeholder UI only
  - `missing/empty` = file missing or empty
- **Data source**
  - `tRPC` = calls `trpc.*`
  - `mock` = hardcoded arrays / placeholder data
  - `n/a` = static content only

## App routes

| Route                       | File                                              |             Status | Data source        | Auth                        | Notes                                                                         |
| --------------------------- | ------------------------------------------------- | -----------------: | ------------------ | --------------------------- | ----------------------------------------------------------------------------- |
| `/`                         | `src/app/(main)/page.tsx`                         |        implemented | mixed              | public                      | Uses server home sections; CMS/cache-backed for hero/featured/announcement.   |
| `/products/[slug]`          | `src/app/(main)/products/[slug]/page.tsx`         | implemented (mock) | mock               | public                      | Uses `mockProducts` + `generateStaticParams()` from mock list.                |
| `/collections`              | `src/app/(main)/collections/page.tsx`             |               stub | n/a                | public                      | Placeholder page; navbar links here.                                          |
| `/collections/all`          | `src/app/(main)/collections/all/page.tsx`         | implemented (mock) | mock               | public                      | Hardcoded product list.                                                       |
| `/collections/men`          | `src/app/(main)/collections/men/page.tsx`         | implemented (mock) | mock               | public                      | Hardcoded product list.                                                       |
| `/collections/women`        | `src/app/(main)/collections/women/page.tsx`       | implemented (mock) | mock               | public                      | Hardcoded product list.                                                       |
| `/collections/new`          | `src/app/(main)/collections/new/page.tsx`         | implemented (mock) | mock               | public                      | Hardcoded product list.                                                       |
| `/collections/sale`         | `src/app/(main)/collections/sale/page.tsx`        | implemented (mock) | mock               | public                      | Hardcoded product list.                                                       |
| `/collections/accessories`  | `src/app/(main)/collections/accessories/page.tsx` | implemented (mock) | mock               | public                      | Hardcoded product list.                                                       |
| `/collections/summer-2025`  | (none)                                            |      missing/empty | n/a                | public                      | Linked from MobileMenu.                                                       |
| `/collections/essentials`   | (none)                                            |      missing/empty | n/a                | public                      | Linked from MobileMenu.                                                       |
| `/collections/best-sellers` | (none)                                            |      missing/empty | n/a                | public                      | Linked from MobileMenu.                                                       |
| `/cart`                     | `src/app/(main)/cart/page.tsx`                    |        implemented | provider + tRPC    | auth-required (current UX)  | Guest add-to-cart not implemented (forces login).                             |
| `/checkout`                 | `src/app/(main)/checkout/page.tsx`                |      missing/empty | n/a                | intended auth               | File is empty; UI links here. Backend `public.checkout.createSession` exists. |
| `/checkout/success`         | `src/app/(main)/checkout/success/page.tsx`        |        implemented | n/a                | public                      | Clears cart via `useCartStore().clearCart()`.                                 |
| `/search`                   | `src/app/(main)/search/page.tsx`                  |               stub | n/a                | public                      | Placeholder page; mobile menu links here.                                     |
| `/wishlist`                 | `src/app/(main)/wishlist/page.tsx`                |        implemented | tRPC               | protected                   | Uses `trpc.public.wishlist.*`.                                                |
| `/account`                  | `src/app/(main)/account/page.tsx`                 |        implemented | tRPC               | protected                   | Account dashboard.                                                            |
| `/account/orders`           | `src/app/(main)/account/orders/page.tsx`          |        implemented | tRPC               | protected                   | Customer order history.                                                       |
| `/account/orders/[id]`      | `src/app/(main)/account/orders/[id]/page.tsx`     |        implemented | tRPC               | protected                   | Customer order detail.                                                        |
| `/account/profile`          | `src/app/(main)/account/profile/page.tsx`         |        implemented | tRPC               | protected                   | Profile page.                                                                 |
| `/account/addresses`        | `src/app/(main)/account/addresses/page.tsx`       |        implemented | tRPC               | protected                   | Addresses CRUD.                                                               |
| `/login`                    | `src/app/(auth)/login/page.tsx`                   |        implemented | n/a                | public                      | Wrapper around `LoginCard`.                                                   |
| `/signup`                   | `src/app/(auth)/signup/page.tsx`                  |        implemented | n/a                | public                      | Wrapper around `SignupCard`.                                                  |
| `/verify-email`             | `src/app/(auth)/verify-email/page.tsx`            |        implemented | REST               | public                      | Client verification flow calling `/api/auth/verify-email`.                    |
| `/check-email`              | `src/app/(auth)/check-email/page.tsx`             |        implemented | Better Auth client | public                      | Resend verification email with cooldown.                                      |
| `/settings`                 | (none)                                            |      missing/empty | n/a                | protected?                  | Linked from `UserDialog`.                                                     |
| `/admin`                    | (none)                                            |      missing/empty | n/a                | protected                   | Linked from `UserDialog` for admins; actual admin entry is `/dashboard`.      |
| `/dashboard`                | `src/app/(admin)/dashboard/page.tsx`              |        implemented | tRPC               | protected                   | Admin dashboard.                                                              |
| `/dashboard/settings`       | `src/app/(admin)/dashboard/settings/page.tsx`     |        implemented | tRPC               | protected                   | Admin settings.                                                               |
| `/orders`                   | `src/app/(admin)/orders/page.tsx`                 |        implemented | tRPC               | protected                   | Admin orders list; UI links to `/orders/[id]` but detail route missing.       |
| `/orders/[id]`              | (none)                                            |      missing/empty | n/a                | protected                   | Admin UI links here but no route exists under `(admin)`.                      |
| `/products`                 | `src/app/(admin)/products/page.tsx`               |        implemented | tRPC               | NOT protected by middleware | Route collision with public `/products/[slug]`.                               |
| `/products/new`             | `src/app/(admin)/products/new/page.tsx`           |        implemented | mixed              | NOT protected by middleware | Create UI mostly UI-only.                                                     |
| `/admin/products/[id]`      | (none)                                            |      missing/empty | n/a                | protected                   | ProductsTable links to this path but no route exists.                         |

## Missing public pages referenced by UI (dead links)

Source: `src/components/layout/Footer.tsx` and CMS defaults.

| Route             |        Status | Notes                                 |
| ----------------- | ------------: | ------------------------------------- |
| `/contact`        | missing/empty | Footer link                           |
| `/shipping`       | missing/empty | Footer link                           |
| `/returns`        | missing/empty | Footer link                           |
| `/size-guide`     | missing/empty | Footer link                           |
| `/faq`            | missing/empty | Footer link                           |
| `/about`          | missing/empty | Footer link + brand story default CTA |
| `/careers`        | missing/empty | Footer link                           |
| `/sustainability` | missing/empty | Footer link                           |
| `/press`          | missing/empty | Footer link                           |
| `/blog`           | missing/empty | Footer link                           |
| `/privacy`        | missing/empty | Footer link                           |
| `/terms`          | missing/empty | Footer link                           |

## Route-group layouts

| Layout | File                         | Notes                                                             |
| ------ | ---------------------------- | ----------------------------------------------------------------- |
| Root   | `src/app/layout.tsx`         | Temporary simplified root layout. Providers live in route groups. |
| Main   | `src/app/(main)/layout.tsx`  | `TRPCProvider` + `CartProvider` + navbar/footer/drawer.           |
| Admin  | `src/app/(admin)/layout.tsx` | `TRPCProvider` + admin shell.                                     |
| Auth   | `src/app/(auth)/layout.tsx`  | Simple centered layout.                                           |

## API routes (quick map)

| Route                 | File                                  |      Status | Notes                                                                               |
| --------------------- | ------------------------------------- | ----------: | ----------------------------------------------------------------------------------- |
| `/api/trpc/*`         | `src/app/api/trpc/[trpc]/route.ts`    | implemented | tRPC handler.                                                                       |
| `/api/auth/*`         | `src/app/api/auth/[...all]/route.ts`  | implemented | Better Auth handler.                                                                |
| `/api/uploadthing`    | `src/app/api/uploadthing/route.ts`    | implemented | UploadThing handler.                                                                |
| `/api/webhook/stripe` | `src/app/api/webhook/stripe/route.ts` | implemented | Verifies signature; sends email; attempts cart clear; **does not create DB order**. |
