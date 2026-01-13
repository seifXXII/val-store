# Admin Products: List + Create Flow Analysis

**Last updated:** 2026-01-13

This document covers the admin product creation UI components and how (or whether) they connect to the backend.

## 1) Route and entry points

- Admin products list page: `src/app/(admin)/products/page.tsx`
- Admin create product page: `src/app/(admin)/products/new/page.tsx`

**Routing concern:** these pages resolve to `/products` and `/products/new` which collides with public `/products/[slug]`.

## 2) Products list header

- File: `src/components/admin/products-list/ProductsListHeader.tsx`

**Current state:** UI-only.

- “Add Product” button is not linked to `/products/new` (no `Link`/navigation).
- Search input has no state management or query integration.
- Filters/Export buttons are placeholders.

## 3) Create product page composition

- File: `src/app/(admin)/products/new/page.tsx`
- Composes:
  - `CreateProductHeader`
  - `BasicInfoSection`
  - `PricingSection`
  - `VariantsSection`
  - `AdditionalDetailsSection`
  - `ProductSidebar`

## 4) CreateProductHeader

- File: `src/components/admin/create-product/CreateProductHeader.tsx`
- Back button links to `/products`.

## 5) BasicInfoSection

- File: `src/components/admin/create-product/BasicInfoSection.tsx`

**Current state:** UI-only.

- Inputs exist for:
  - product name
  - sku
  - description
  - category (Select with hardcoded options)
  - gender (Select with hardcoded options)

**Gap:** no state management + no tRPC integration.

## 6) PricingSection

- File: `src/components/admin/create-product/PricingSection.tsx`

**Current state:** UI-only.

- Inputs exist for base/sale/cost prices.
- No state wiring or tRPC integration in this component.

## 7) VariantsSection

- File: `src/components/admin/create-product/VariantsSection.tsx`

**Current state:** partially wired.

- Supports 2 modes:
  - With `productId`: fetches and mutates server variants via tRPC
    - `trpc.admin.variants.list({ productId })`
    - `trpc.admin.variants.add`
    - `trpc.admin.variants.update`
    - `trpc.admin.variants.delete`
  - Without `productId`: manages local variants for the “create product” flow
    - uses `localAdditions` + calls `onVariantsChange()`

**Gap:** in `src/app/(admin)/products/new/page.tsx` nothing currently passes `productId` or `onVariantsChange`, so variants are not persisted in the create flow.

## 8) ImageUploadSection

- File: `src/components/admin/create-product/ImageUploadSection.tsx`

**Current state:** partially wired.

- Supports 2 modes:
  - With `productId`: fetches and mutates server images via tRPC
    - `trpc.admin.images.list({ productId })`
    - `trpc.admin.images.add`
    - `trpc.admin.images.delete`
    - `trpc.admin.images.setPrimary`
  - Without `productId`: manages `localImages` and notifies parent via `onImagesChange()`.

- Uses UploadThing UI:
  - `UploadDropzone endpoint="productImage"`

**Gaps / integration notes:**

- `ImageUploadSection` is not used in the current `ProductSidebar` (sidebar has placeholder upload UI).
- `src/app/(admin)/products/new/page.tsx` does not pass `productId` or `onImagesChange` anywhere.

## 9) AdditionalDetailsSection

- File: `src/components/admin/create-product/AdditionalDetailsSection.tsx`

**Current state:** UI-only.

- Material + care instructions inputs exist.
- No state wiring or tRPC integration.

## 10) ProductSidebar

- File: `src/components/admin/create-product/ProductSidebar.tsx`

**Current state:** UI-only.

- Images area is placeholder (no UploadThing integration here yet).
- SEO fields exist (meta title/description), but no state wiring.
- Action buttons:
  - Publish
  - Save Draft

**Gap:** no submit handler / mutation.

## 11) Summary

- Admin product list uses real tRPC for listing (see `ProductsTable.tsx`), but header actions/search/filtering are placeholders.
- The create product UI is well-laid-out, but the end-to-end create workflow is not wired.
- `VariantsSection` and `ImageUploadSection` are designed to support both:
  - creating locally (before product exists)
  - editing existing product (with `productId`)

  However, the current `/products/new` page does not connect these pieces.
