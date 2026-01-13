# Settings & CMS Subsystem Review

**Last updated:** 2026-01-13

This doc covers the admin settings/CMS subsystem end-to-end: admin UI entry points → tRPC router → domain validation → repository responsibilities → storefront consumption.

## 1) Admin UI entry point

- Admin settings page: `src/app/(admin)/dashboard/settings/page.tsx`
  - Tabbed UI: `homepage`, `store`, `appearance`, `featured`
  - Imports from `@/components/admin/settings`:
    - `HomepageSettings`
    - `StoreSettings`
    - `AppearanceSettings`
    - `FeaturedSettings`

## 2) Admin API (tRPC): settings router

- Router file: `src/server/routers/admin/settings.ts`
- Protected by `adminProcedure`.

### 2.1 Site settings

- `getSiteSettings`
  - Calls `repo.getSiteSettings()`.
  - If missing, initializes defaults: `repo.initializeSiteSettings()`.
  - Returns `settings.toObject()`.

- `updateSiteSettings`
  - Validates via `updateSiteSettingsSchema`.
  - Calls `repo.updateSiteSettings(input, ctx.user.id)`.

### 2.2 Content sections

- `getContentSection({ sectionType })`
  - Retrieves section from repo.
  - Returns `content` parsed from JSON.

- `getAllContentSections()`
  - Retrieves all sections and parses `content` JSON.

- `updateContentSection({ sectionType, content, displayOrder?, isActive? })`
  - Validates `content` with a union of schemas.
  - Stores `content` as JSON string.
  - Repo implementation saves history and increments version.

- `toggleSectionStatus({ sectionType })`
  - Reads current section and flips `isActive`.

### 2.3 Content history

- `getContentHistory({ sectionType })`
  - Returns parsed JSON content.

- `revertToVersion({ sectionType, version })`
  - Restores content from a prior version and returns parsed JSON.

### 2.4 Featured items

- `getFeaturedItems({ section })`
- `updateFeaturedItems({ section, items })` (replaces all)
- `addFeaturedItem(item)`
- `removeFeaturedItem({ id })`
- `reorderFeaturedItems({ section, orderedIds })`

## 3) Domain validation (content schemas)

- File: `src/domain/value-objects/content-schemas.ts`

Defines section schemas for:

- hero
- announcement
- promo banner
- brand story
- newsletter
- instagram

Notable defaults:

- `hero.ctaLink` defaults to `"/collections"` (but `/collections` index route is currently a stub; many components use `/collections/all` instead).

## 4) Repository boundary (Drizzle implementation)

- Repository file: `src/infrastructure/database/repositories/site-config.repository.ts`
- Class: `DrizzleSiteConfigRepository`

### 4.1 Tables used

- `siteSettings`
- `contentSections`
- `contentSectionsHistory`
- `featuredItems`

### 4.2 Key behaviors

- `updateContentSection()` writes a history entry before updating and increments `version`.
- `getActiveContentSections()` supports storefront filtering.

**Non-transactional operations to note:**

- `updateFeaturedItems()` does delete-then-insert (could temporarily leave empty if insert fails).
- `reorderFeaturedItems()` updates rows in parallel (partial reorder possible if one update fails).

## 5) Storefront consumption (server components + cache)

### 5.1 Cache layer

- File: `src/lib/cache.ts`
- Uses `unstable_cache` with `revalidate = 60` seconds.
- Tags include:
  - `hero-section`
  - `announcement`
  - `site-settings`
  - `featured-products`
  - `categories`

The cache layer pulls from:

- `SiteConfigRepository` for hero/announcement/settings
- `ProductRepository` for featured products
- `CategoryRepository` for categories

**Note:** without explicit `revalidateTag(...)` calls after admin updates, data changes can be delayed up to 60 seconds.

### 5.2 Hero section

- Server component: `src/components/home/ServerHeroSection.tsx`
- Reads: `getCachedHeroSection()`
- Behavior:
  - Uses robust defaults (`DEFAULT_HERO`)
  - If CMS section exists and isActive, merges CMS content onto defaults
  - Falls back to defaults on errors

### 5.3 Announcement bar

- Server component: `src/components/layout/ServerAnnouncementBar.tsx`
- Reads: `getCachedAnnouncementSection()`
- Behavior:
  - Returns `null` if section not active or no messages
  - Passes content to `AnnouncementBarClient` for rotation/dismiss

### 5.4 Featured products

- Server component: `src/components/home/ServerFeaturedProducts.tsx`
- Reads: `getCachedFeaturedProducts(limit)`
- Behavior:
  - Renders empty state text if no products
  - “View All Products” links to `/collections/all`

### 5.5 Featured categories

- Server component: `src/components/home/ServerFeaturedCategories.tsx`
- Reads: `getCachedCategories()` and then calculates product counts.

**Performance note:** It calls `productRepo.findAll()` inside a `Promise.all` for each category, and then filters in-memory.

- This should be replaced with a repo method like `countByCategoryIds([...])` or a single aggregated DB query.

## 6) Next things to verify

- Whether admin settings UI components correctly call the settings router.
- Whether there is a revalidation strategy for `CACHE_TAGS` (hero/announcement/etc.).
