# Public Routers vs Storefront Pages (Mock vs DB-backed)

**Last updated:** 2026-01-13

This doc compares what the public tRPC routers expose vs what the storefront pages/components currently use.

## 1) Public router aggregation

- File: `src/server/routers/public/index.ts`

Mounted routers:

- `public.products` (no auth)
- `public.categories` (no auth)
- `public.config` (no auth)
- `public.user` (no auth)
- `public.cart` (protected)
- `public.checkout` (protected)
- `public.orders` (protected)
- `public.wishlist` (protected)
- `public.address` (protected)
- `public.profile` (protected)

**Note:** despite the namespace `public.*`, several routers are auth-only by design.

## 2) Public products router

- File: `src/server/routers/public/products.ts`

### 2.1 `public.products.list`

- Supports optional input: `categoryId`, `limit`, `offset`.
- Implementation detail: fetches all matching products then slices in memory.

**Gaps / risks:**

- Inefficient pagination: `repo.findAll(...)` returns all products, then `.slice()` applies limit/offset.

### 2.2 `public.products.getBySlug`

- Returns product detail + images + variants.
- Filters out inactive products and unavailable variants.
- Does **not** expose stock quantity (only `inStock`).

### 2.3 `public.products.getFeatured`

- Fetches featured products using `repo.findAll({ isActive: true, isFeatured: true })` then slices.

### 2.4 `public.products.search`

- Current behavior: loads **all active products** and filters in-memory by name/description.

**Gap:** should be DB-backed search later.

## 3) Public categories router

- File: `src/server/routers/public/categories.ts`

### 3.1 `public.categories.list`

- Returns active categories and computes `productCount` by calling `productRepo.findAll(...)` per category.

**Performance gap:** N+1 query pattern.

### 3.2 `public.categories.getBySlug`

- Returns category + products for that category.

### 3.3 `public.categories.getFeatured`

- Uses `siteConfigRepo.getFeaturedItemsByType("homepage_categories", "category")` to pick categories.
- Still uses per-category `productRepo.findAll(...)` to compute productCount.

## 4) Storefront pages current state

### 4.1 Product detail page is mock-backed

- File: `src/app/(main)/products/[slug]/page.tsx`
- Uses `mockProducts` and does not call `public.products.getBySlug`.

### 4.2 Collections pages are mock-backed

- Files under: `src/app/(main)/collections/*`
- Use hardcoded arrays.

### 4.3 Search page is a stub

- File: `src/app/(main)/search/page.tsx`
- Does not call `public.products.search`.

## 5) Already DB-backed storefront components

- `ServerFeaturedProducts` uses cached `productRepository.findFeatured(limit)` via `src/lib/cache.ts`.
- `ServerFeaturedCategories` uses cached categories, but computes product counts in-memory via `findAll()` (performance issue).

## 6) Practical conclusion

- The **backend API for storefront products/categories exists**, but the storefront pages are not wired to it.
- The simplest integration path is:
  - Replace mock product detail page with `public.products.getBySlug`.
  - Replace collections pages with either:
    - `public.products.list({ categoryId })`
    - or `public.categories.getBySlug(slug)`.
  - Implement `/search` page using `public.products.search` (later improve to DB search).
