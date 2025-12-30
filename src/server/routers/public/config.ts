/**
 * Public Config Router
 *
 * Public endpoints for site configuration.
 * Returns only public-safe data (no admin info).
 */

import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { container } from "@/application/container";

export const publicConfigRouter = router({
  /**
   * Get public site settings
   */
  getSiteSettings: publicProcedure.query(async () => {
    const repo = container.getSiteConfigRepository();
    const settings = await repo.getSiteSettings();

    if (!settings) {
      return {
        storeName: "Val Store",
        storeTagline: null,
        logoUrl: null,
        currency: "USD",
        socialLinks: {},
      };
    }

    // Return only public-safe fields
    return {
      storeName: settings.storeName,
      storeTagline: settings.storeTagline,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      currency: settings.currency,
      locale: settings.locale,
      defaultMetaTitle: settings.defaultMetaTitle,
      defaultMetaDescription: settings.defaultMetaDescription,
      socialLinks: settings.socialLinks,
    };
  }),

  /**
   * Get a specific content section
   */
  getSection: publicProcedure
    .input(
      z.object({
        sectionType: z.enum([
          "hero",
          "announcement",
          "promo_banner",
          "brand_story",
          "newsletter",
          "instagram",
        ]),
      })
    )
    .query(async ({ input }) => {
      const repo = container.getSiteConfigRepository();
      const section = await repo.getContentSection(input.sectionType);

      if (!section || !section.isActive) {
        return null;
      }

      return {
        sectionType: section.sectionType,
        content: JSON.parse(section.content),
        displayOrder: section.displayOrder,
      };
    }),

  /**
   * Get all active content sections
   */
  getAllSections: publicProcedure.query(async () => {
    const repo = container.getSiteConfigRepository();
    const sections = await repo.getActiveContentSections();

    return sections.map((s) => ({
      sectionType: s.sectionType,
      content: JSON.parse(s.content),
      displayOrder: s.displayOrder,
    }));
  }),
});
