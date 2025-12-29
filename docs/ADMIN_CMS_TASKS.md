# Admin CMS - Implementation Tasks

## Overview

Custom CMS allowing super admins to customize all storefront aspects.

**Architecture:**

- Database: Hybrid (typed settings + JSON content + history)
- API: Separate `public` router

---

## Phase 1: Database Schema

### 1.1 Add Tables to `src/db/schema.ts`

- [ ] Add `site_settings` table

  ```typescript
  // Store identity, contact, social, currency, SEO
  site_settings: (store_name,
    logo_url,
    contact_email,
    contact_phone,
    instagram_url,
    facebook_url,
    twitter_url,
    tiktok_url,
    currency,
    locale,
    default_meta_title,
    default_meta_description);
  ```

- [ ] Add `content_sections` table

  ```typescript
  // Flexible JSON content per section type
  content_sections: (section_type(UNIQUE),
    content(JSONB),
    display_order,
    is_active,
    version);
  ```

- [ ] Add `content_sections_history` table

  ```typescript
  // Version history for rollback
  content_sections_history: (section_id, section_type, content(JSONB), version);
  ```

- [ ] Add `featured_items` table

  ```typescript
  // Featured products/categories
  featured_items: (item_type, item_id, section, display_order, is_active);
  ```

- [ ] Run migration
  ```bash
  pnpm db:generate && pnpm db:push
  ```

---

## Phase 2: Domain Layer

### 2.1 Entities

- [ ] Create `src/domain/entities/site-settings.entity.ts`
- [ ] Create `src/domain/entities/content-section.entity.ts`
- [ ] Create `src/domain/entities/featured-item.entity.ts`

### 2.2 Repository Interface

- [ ] Create `src/domain/interfaces/repositories/site-config.repository.interface.ts`
  - `getSiteSettings(): Promise<SiteSettings>`
  - `updateSiteSettings(data): Promise<SiteSettings>`
  - `getContentSection(type): Promise<ContentSection>`
  - `updateContentSection(type, content): Promise<ContentSection>`
  - `getContentHistory(type): Promise<ContentSectionHistory[]>`
  - `revertToVersion(type, version): Promise<ContentSection>`
  - `getFeaturedItems(section): Promise<FeaturedItem[]>`
  - `updateFeaturedItems(section, items): Promise<void>`

### 2.3 Repository Implementation

- [ ] Create `src/infrastructure/database/repositories/site-config.repository.ts`
- [ ] Implement history auto-save on content update
- [ ] Add to DI container (`src/application/container.ts`)

---

## Phase 3: Content Section Schemas

### 3.1 Zod Schemas for JSON Validation

- [ ] Create `src/domain/value-objects/content-schemas.ts`

```typescript
// Hero Section
heroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  backgroundImage: z.string().url(),
  backgroundVideo: z.string().url().optional(),
  overlayOpacity: z.number().min(0).max(100),
  ctaText: z.string(),
  ctaLink: z.string(),
});

// Announcement Bar
announcementSchema = z.object({
  messages: z.array(
    z.object({
      text: z.string(),
      link: z.string().optional(),
    })
  ),
  rotateInterval: z.number(),
  backgroundColor: z.string(),
  textColor: z.string(),
  dismissible: z.boolean(),
});

// Promo Banner
promoBannerSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  image: z.string().url(),
  imagePosition: z.enum(["left", "right"]),
  ctaText: z.string(),
  ctaLink: z.string(),
});

// Brand Story
brandStorySchema = z.object({
  preheading: z.string(),
  title: z.string(),
  paragraphs: z.array(z.string()),
  image: z.string().url(),
  ctaText: z.string(),
  ctaLink: z.string(),
});

// Newsletter
newsletterSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  incentive: z.string(),
  buttonText: z.string(),
});

// Instagram Feed
instagramSchema = z.object({
  handle: z.string(),
  profileUrl: z.string().url(),
  images: z.array(z.string().url()),
});
```

---

## Phase 4: Admin tRPC Endpoints

### 4.1 Settings Router

- [ ] Create `src/server/routers/admin/settings.ts`

| Endpoint               | Type     | Description                    |
| ---------------------- | -------- | ------------------------------ |
| `getSiteSettings`      | query    | Get all site settings          |
| `updateSiteSettings`   | mutation | Update site settings           |
| `getContentSection`    | query    | Get section by type            |
| `updateContentSection` | mutation | Update section (saves history) |
| `listContentSections`  | query    | Get all sections               |
| `getContentHistory`    | query    | Get version history            |
| `revertToVersion`      | mutation | Revert to previous version     |
| `getFeaturedItems`     | query    | Get featured items by section  |
| `updateFeaturedItems`  | mutation | Update featured items          |

- [ ] Add to `src/server/routers/admin/index.ts`

---

## Phase 5: Admin Settings UI

### 5.1 Settings Hub

- [ ] Create `src/app/(admin)/dashboard/settings/page.tsx`
  - Tab navigation: Homepage, Store, Appearance, Featured

### 5.2 Homepage Settings

- [ ] Create `src/app/(admin)/dashboard/settings/homepage/page.tsx`
- [ ] Create `src/components/admin/settings/HeroEditor.tsx`
  - Title, subtitle, CTA editors
  - Background image upload (Uploadthing)
  - Overlay opacity slider
  - Live preview
- [ ] Create `src/components/admin/settings/AnnouncementEditor.tsx`
  - Message list manager
  - Add/remove/reorder messages
- [ ] Create `src/components/admin/settings/SectionManager.tsx`
  - Enable/disable sections
  - Reorder sections

### 5.3 Store Settings

- [ ] Create `src/app/(admin)/dashboard/settings/store/page.tsx`
  - Store name, tagline
  - Contact email, phone
  - Currency dropdown
  - SEO defaults

### 5.4 Appearance Settings

- [ ] Create `src/app/(admin)/dashboard/settings/appearance/page.tsx`
  - Logo upload
  - Social media links

### 5.5 Featured Items Manager

- [ ] Create `src/app/(admin)/dashboard/settings/featured/page.tsx`
- [ ] Create `src/components/admin/settings/FeaturedItemsManager.tsx`
  - Search and select products/categories
  - Drag and drop reorder
  - Toggle active/inactive

### 5.6 Version History

- [ ] Create `src/components/admin/settings/VersionHistory.tsx`
  - List of past versions with timestamps
  - Preview old content
  - One-click revert button

---

## Phase 6: Public API

### 6.1 Public Router

- [ ] Create `src/server/routers/public/index.ts`

### 6.2 Public Products

- [ ] Create `src/server/routers/public/products.ts`

| Endpoint         | Returns           | Filter                                 |
| ---------------- | ----------------- | -------------------------------------- |
| `list`           | Active products   | `isActive: true`, excludes `costPrice` |
| `getBySlug`      | Single product    | With images, variants                  |
| `getFeatured`    | Featured products | From `featured_items` table            |
| `getNewArrivals` | Recent products   | Created in last N days                 |
| `search`         | Search results    | Active products only                   |

### 6.3 Public Categories

- [ ] Create `src/server/routers/public/categories.ts`

| Endpoint      | Returns                |
| ------------- | ---------------------- |
| `list`        | Active categories      |
| `getBySlug`   | Category with products |
| `getFeatured` | Featured categories    |

### 6.4 Public Config

- [ ] Create `src/server/routers/public/config.ts`

| Endpoint          | Returns                              |
| ----------------- | ------------------------------------ |
| `getSiteSettings` | Public settings (name, logo, social) |
| `getSection`      | Content section by type              |
| `getAllSections`  | All active sections                  |

- [ ] Add public router to `src/server/index.ts`

---

## Phase 7: Homepage Integration

### 7.1 Dynamic Components

- [ ] Update `src/components/home/HeroSection.tsx`
  - Fetch config from `public.config.getSection('hero')`
  - Render dynamic title, subtitle, CTA, background

- [ ] Update `src/components/home/FeaturedProducts.tsx`
  - Fetch from `public.products.getFeatured`

- [ ] Update `src/components/home/FeaturedCategories.tsx`
  - Fetch from `public.categories.getFeatured`

- [ ] Update `src/components/layout/Footer.tsx`
  - Fetch social links from `public.config.getSiteSettings`

### 7.2 New Components

- [ ] Create `src/components/layout/AnnouncementBar.tsx`
  - Rotating messages
  - Dismissible with localStorage
  - Dynamic colors

---

## Phase 8: Verification

### 8.1 Type Check

- [ ] Run `pnpm type-check` - passes

### 8.2 Admin Functionality

- [ ] Admin can access `/dashboard/settings`
- [ ] Admin can edit site settings
- [ ] Admin can edit hero section
- [ ] Admin can edit announcements
- [ ] Admin can manage featured items
- [ ] Admin can view version history
- [ ] Admin can revert to previous version
- [ ] Image uploads work (Uploadthing)

### 8.3 Public API Security

- [ ] `public.products.list` returns only active products
- [ ] `public.products.list` excludes `costPrice`, `adminNotes`
- [ ] `public.config.*` returns only public data

### 8.4 Homepage

- [ ] Homepage displays dynamic content from config
- [ ] Announcement bar shows messages
- [ ] Featured products match admin selection
- [ ] Changes in admin reflect on homepage after refresh
