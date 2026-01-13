# Broken / Risky Hardcoded Links in Codebase

**Last updated:** 2026-01-13

This document lists hardcoded links/redirects found in the codebase that are currently broken (no matching route), risky (route collision), or point to an empty page.

## 1) Confirmed broken redirects

### 1.1 Account layout redirects to a non-existent login path

- **File:** `src/app/(main)/account/layout.tsx`
- **Code:** `redirect("/auth/login?callbackUrl=/account")`
- **Issue:** there is no `/auth/login` route. Login page is at `/login`.

### 1.2 Wishlist button redirects to a non-existent login path

- **File:** `src/components/products/WishlistButton.tsx`
- **Code:** `router.push(`/auth/login?callbackUrl=${window.location.pathname}`)`
- **Issue:** there is no `/auth/login` route. Login page is at `/login`.

### 1.3 Profile page password link points to a non-existent route

- **File:** `src/app/(main)/account/profile/page.tsx`
- **Code:** `<a href="/auth/forgot-password">Change Password</a>`
- **Issue:** there is no `/auth/forgot-password` route found in `src/app`.

## 2) Confirmed broken admin links (missing routes)

### 2.1 Admin orders table → order detail

- **File:** `src/components/admin/orders-list/OrdersTable.tsx`
- **Code:** `Link href={\`/orders/${order.id}\`}`
- **Issue:** there is no `src/app/(admin)/orders/[id]/page.tsx` route.

### 2.2 Admin dashboard recent orders → order detail

- **File:** `src/components/admin/dashboard/RecentOrders.tsx`
- **Code:** `href={\`/orders/${order.id}\`}`
- **Issue:** same missing admin order detail route.

### 2.3 Admin products table → product detail/edit

- **File:** `src/components/admin/products-list/ProductsTable.tsx`
- **Code:** `Link href={\`/admin/products/${product.id}\`}`
- **Issue:** there is no `/admin/*` route group in `src/app`. This link is broken.

## 3) Risky / inconsistent admin links (routing collisions)

### 3.1 Admin create product header → products list

- **File:** `src/components/admin/create-product/CreateProductHeader.tsx`
- **Code:** `Link href="/products"`
- **Issue:** `/products` is currently used by admin list page, but it collides with public `/products/[slug]`.

## 4) Links to empty/missing pages (checkout)

- **File:** `src/components/cart/CartSummary.tsx`
  - `Link href="/checkout"`
- **File:** `src/components/cart/CartDrawer.tsx`
  - `Link href="/checkout"`

**Issue:** `src/app/(main)/checkout/page.tsx` is empty.

## 5) Links to missing public pages (dead links)

### 5.1 Footer link objects (dynamic)

- **File:** `src/components/layout/Footer.tsx`
- **Paths (href values inside arrays):**
  - `/contact`
  - `/shipping`
  - `/returns`
  - `/size-guide`
  - `/faq`
  - `/about`
  - `/careers`
  - `/sustainability`
  - `/press`
  - `/blog`
  - `/privacy`
  - `/terms`

### 5.2 Brand story CTA

- **File:** `src/components/home/BrandStory.tsx`
- **Default CTA link:** `ctaLink = "/about"`
- **Issue:** `/about` route does not currently exist.

### 5.3 CMS schema defaults

- **File:** `src/domain/value-objects/content-schemas.ts`
- **Default:** `brandStory.ctaLink` defaults to `/about`.

## 6) Navigation surfaces review (Navbar / MobileMenu)

### 6.1 Desktop navbar links

- **File:** `src/components/layout/Navbar.tsx`
- **Links:**
  - `/collections/all` (exists, mock-backed)
  - `/collections/new` (exists, mock-backed)
  - `/collections` (**stub**, navbar links to it)
  - `/collections/sale` (exists, mock-backed)

### 6.2 Navbar session + wishlist assumptions

- `Navbar.tsx` uses `trpc.public.user.getSession` to decide logged-in/admin state.
- `Navbar.tsx` calls `trpc.public.wishlist.getCount` unconditionally.
  - This procedure is protected; if unauthenticated, it may error depending on tRPC client behavior.

### 6.3 Mobile menu has links to collections that do not exist

- **File:** `src/components/layout/MobileMenu.tsx`
- **Links:**
  - `/collections/summer-2025` (missing)
  - `/collections/essentials` (missing)
  - `/collections/best-sellers` (missing)

## 7) Admin navigation surfaces review (AdminSidebar/AdminHeader)

### 7.1 AdminSidebar links to many missing admin pages

- **File:** `src/components/admin/AdminSidebar.tsx`
- **Links:**
  - `/dashboard` (exists)
  - `/products` (exists but collision + not middleware-protected)
  - `/orders` (exists)
  - `/dashboard/settings` (exists)
  - `/inventory` (missing)
  - `/customers` (missing)
  - `/reviews` (missing)
  - `/coupons` (missing)
  - `/analytics` (missing)

### 7.2 AdminHeader

- **File:** `src/components/admin/AdminHeader.tsx`
- **Notes:** no route links inside header.

## 8) UserDialog links (broken)

- **File:** `src/components/UserDialog.tsx`

When logged in, it links to:

- `href="/orders"` with label “My Orders”
  - **Issue:** this points to the admin orders list, not customer order history.
  - Customer orders are under `/account/orders`.

- `href="/settings"`
  - **Issue:** no `/settings` route exists.

- For admins it links to:
  - `href="/admin"`
  - **Issue:** no `/admin` route exists; admin dashboard is `/dashboard`.

## 9) Notes from middleware comments

- **File:** `src/middleware.ts`
- **Comment:** “Admin product management is under `/dashboard/products`”
- **Issue:** no such route exists currently; admin products are under `/products`.

## 10) Suggested resolution strategy (not implementation yet)

1. Pick an admin URL prefix (`/dashboard/*` or `/admin/*`) and move all admin routes there.
2. Fix redirects to use `/login` (and add a consistent query parameter name such as `redirect`).
3. Fix `UserDialog` to link to customer routes (`/account/orders`) and existing settings route(s).
4. Add missing admin detail routes or update links to existing pages.
5. Implement `/checkout` to call `public.checkout.createSession` and redirect to Stripe.
6. Add placeholder public pages for footer links to avoid 404s.
7. Remove or implement missing mobile collections routes.
8. Remove or implement missing admin sidebar routes (inventory/customers/reviews/coupons/analytics).
