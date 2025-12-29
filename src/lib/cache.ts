/**
 * Cached Data Fetchers
 *
 * Uses Next.js unstable_cache to cache database queries for 60 seconds.
 * This reduces database load and improves page load times.
 *
 * How it works:
 * - First request: Fetches from database, stores in cache
 * - Next 60 seconds: Returns cached data (no DB query)
 * - After 60 seconds: Fetches fresh data, updates cache
 */

import { unstable_cache } from "next/cache";
import { container } from "@/application/container";

// Cache tags for easy invalidation
const CACHE_TAGS = {
  HERO: "hero-section",
  SITE_SETTINGS: "site-settings",
  FEATURED_PRODUCTS: "featured-products",
  CATEGORIES: "categories",
  ANNOUNCEMENT: "announcement",
} as const;

// Default revalidation time (60 seconds)
const DEFAULT_REVALIDATE = 60;

/**
 * Get hero section content with caching
 */
export const getCachedHeroSection = unstable_cache(
  async () => {
    const repo = container.getSiteConfigRepository();
    const section = await repo.getContentSection("hero");
    if (!section) return null;

    return {
      isActive: section.isActive,
      content: section.content,
      getContentParsed: <T>() => JSON.parse(section.content) as T,
    };
  },
  [CACHE_TAGS.HERO],
  { revalidate: DEFAULT_REVALIDATE, tags: [CACHE_TAGS.HERO] }
);

/**
 * Get site settings with caching
 */
export const getCachedSiteSettings = unstable_cache(
  async () => {
    const repo = container.getSiteConfigRepository();
    return repo.getSiteSettings();
  },
  [CACHE_TAGS.SITE_SETTINGS],
  { revalidate: DEFAULT_REVALIDATE, tags: [CACHE_TAGS.SITE_SETTINGS] }
);

/**
 * Get announcement section with caching
 */
export const getCachedAnnouncementSection = unstable_cache(
  async () => {
    const repo = container.getSiteConfigRepository();
    const section = await repo.getContentSection("announcement");
    if (!section) return null;

    return {
      isActive: section.isActive,
      content: section.content,
      getContentParsed: <T>() => JSON.parse(section.content) as T,
    };
  },
  [CACHE_TAGS.ANNOUNCEMENT],
  { revalidate: DEFAULT_REVALIDATE, tags: [CACHE_TAGS.ANNOUNCEMENT] }
);

/**
 * Get featured products with caching
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (limit: number = 8) => {
    const repo = container.getProductRepository();
    const products = await repo.findFeatured(limit);

    // Return serializable data only
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      salePrice: p.salePrice,
      isFeatured: p.isFeatured,
    }));
  },
  [CACHE_TAGS.FEATURED_PRODUCTS],
  { revalidate: DEFAULT_REVALIDATE, tags: [CACHE_TAGS.FEATURED_PRODUCTS] }
);

/**
 * Get all categories with caching
 */
export const getCachedCategories = unstable_cache(
  async () => {
    const repo = container.getCategoryRepository();
    const categories = await repo.findAll();

    // Return serializable data only
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isActive: c.isActive,
    }));
  },
  [CACHE_TAGS.CATEGORIES],
  { revalidate: DEFAULT_REVALIDATE, tags: [CACHE_TAGS.CATEGORIES] }
);

/**
 * Get products by category with caching
 */
export const getCachedProductsByCategory = unstable_cache(
  async (categoryId: string) => {
    const repo = container.getProductRepository();
    const products = await repo.findByCategory(categoryId);

    return products
      .filter((p) => p.isActive)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
      }));
  },
  ["products-by-category"],
  { revalidate: DEFAULT_REVALIDATE }
);

// Export cache tags for revalidation
export { CACHE_TAGS };
