# UploadThing + Product Images Integration Review

**Last updated:** 2026-01-13

This doc traces image upload from UI → UploadThing → persistence via tRPC.

## 1) UploadThing route

- API handler: `src/app/api/uploadthing/route.ts`
  - Mounts UploadThing at `/api/uploadthing`
  - Uses `createRouteHandler({ router: uploadRouter })`

## 2) UploadThing router configuration

- Config: `src/lib/uploadthing.ts`

### 2.1 Endpoints

- `productImage`
  - `image` only
  - `maxFileSize: 4MB`
  - `maxFileCount: 10`
  - Middleware: requires authentication
  - **Comment says**: only `admin/super_admin` can upload, but **code does not enforce role check** (it has a TODO comment).

- `categoryImage`
  - single image, max 2MB
  - auth required

- `userAvatar`
  - single image, max 1MB
  - auth required

### 2.2 Metadata

- Middleware returns `{ userId }`.
- `onUploadComplete` returns `{ url: file.ufsUrl }`.

## 3) Admin UI: ImageUploadSection

- File: `src/components/admin/create-product/ImageUploadSection.tsx`
- Uses:
  - `UploadDropzone endpoint="productImage"`
  - `trpc.admin.images.list/add/delete/setPrimary`
- Behavior:
  - If `productId` exists: uploads → immediately calls `admin.images.add` to persist image record.
  - If `productId` missing: keeps images in local state and optionally calls `onImagesChange()`.

**Gap:** The current create-product page does not use `ImageUploadSection` (sidebar has placeholder upload UI).

## 4) Admin images router (persistence)

- File: `src/server/routers/admin/images.ts`
- Endpoints:
  - `list({ productId })`
  - `add({ productId, imageUrl, altText, isPrimary })`
  - `delete({ id })`
  - `setPrimary({ productId, imageId })`

## 5) Key issues / gaps

1. **Role enforcement missing in UploadThing middleware**
   - Doc comment says admin-only upload, but code only checks “logged in”.

2. **Create product flow missing `productId`**
   - Without a created product record, images can only be stored locally.
   - Needs a “create draft product → get productId → upload images/variants” workflow.

3. **No association in upload step**
   - UploadThing returns a URL; it does not automatically attach it to a product.
   - The UI correctly calls `admin.images.add` after upload, but only when it has `productId`.

## 6) Recommended next documentation items

- A doc describing the intended admin create product workflow (draft → upload images → add variants → publish).
