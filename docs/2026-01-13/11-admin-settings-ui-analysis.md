# Admin Settings UI Analysis

**Last updated:** 2026-01-13

This document reviews the admin settings UI components under `src/components/admin/settings/*` and how they connect to the settings router.

## 1) HomepageSettings

- File: `src/components/admin/settings/HomepageSettings.tsx`
- Calls:
  - `trpc.admin.settings.getContentSection({ sectionType: "hero" })`
  - `trpc.admin.settings.getContentSection({ sectionType: "announcement" })`
  - `trpc.admin.settings.updateContentSection(...)`
  - `trpc.admin.settings.toggleSectionStatus({ sectionType: "announcement" })`

### Issues / risks

- **Incorrect initialization pattern**
  - It uses `useState(() => { ... setHeroForm(...) })` to initialize from `heroSection`.
  - `useState` is not the right place for side effects; this should be `useEffect`.
  - As written, it likely doesn’t update the form when `heroSection` arrives.

- **Announcement save button likely does nothing**
  - The announcement inputs use `defaultValue=...` but there’s no state + no submit handler calling `updateContentSection` for announcement.
  - The “Save Announcement” button has no `onClick`.

- **Hero CTA link default**
  - Defaults to `/collections`, but `/collections` index is currently a stub.

## 2) StoreSettings

- File: `src/components/admin/settings/StoreSettings.tsx`
- Calls:
  - `trpc.admin.settings.getSiteSettings()`
  - `trpc.admin.settings.updateSiteSettings(form)`
- Uses proper `useEffect` to initialize form from settings.

### Notes

- This component is solid and appears functional end-to-end.

## 3) AppearanceSettings

- File: `src/components/admin/settings/AppearanceSettings.tsx`
- Calls:
  - `trpc.admin.settings.getSiteSettings()`
  - `trpc.admin.settings.updateSiteSettings(form)`

### Gaps

- “Upload” buttons are placeholders; there’s no integration with UploadThing for logo/favicon.
- Uses URL inputs as a fallback, which is fine.

## 4) FeaturedSettings

- File: `src/components/admin/settings/FeaturedSettings.tsx`
- Calls:
  - `trpc.admin.settings.getFeaturedItems({ section: "homepage_featured" })`
  - `trpc.admin.settings.getFeaturedItems({ section: "homepage_categories" })`
  - `trpc.admin.settings.removeFeaturedItem({ id })`

### Gaps

- “Add Product” and “Add Category” buttons have no implementation.
- Search input is local state only; it doesn’t query products/categories.
- UI shows placeholder labels like “Product #1” and only prints `itemId` fragments.
- Drag-to-reorder is hinted (Grip icon) but no reorder mutation is used (`reorderFeaturedItems` exists in API).

## 5) Summary

- Settings backend (`admin.settings.*`) is strong and fairly complete.
- UI is partially complete:
  - StoreSettings / AppearanceSettings are mostly usable.
  - HomepageSettings has at least one broken pattern (useState used like useEffect) and missing save wiring for announcement.
  - FeaturedSettings has remove wiring but missing add/search/reorder wiring.
