/**
 * Public Categories Router
 *
 * Public endpoints for storefront category data.
 */

import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { container } from "@/application/container";

export const publicCategoriesRouter = router({
  /**
   * List active categories with product counts
   */
  list: publicProcedure.query(async () => {
    const repo = container.getCategoryRepository();
    const productRepo = container.getProductRepository();
    const categories = await repo.findAll();

    // Get product counts for each active category
    const categoriesWithCounts = await Promise.all(
      categories
        .filter((c) => c.isActive)
        .map(async (c) => {
          const products = await productRepo.findAll({
            isActive: true,
            categoryId: c.id,
          });
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            imageUrl: c.imageUrl,
            parentId: c.parentId,
            displayOrder: c.displayOrder,
            productCount: products.length,
          };
        })
    );

    return categoriesWithCounts;
  }),

  /**
   * Get category by slug with products
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const categoryRepo = container.getCategoryRepository();
      const category = await categoryRepo.findBySlug(input.slug);

      if (!category || !category.isActive) {
        return null;
      }

      // Get products for this category
      const productRepo = container.getProductRepository();
      const products = await productRepo.findAll({
        isActive: true,
        categoryId: category.id,
      });

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        productCount: products.length,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          basePrice: p.basePrice,
          salePrice: p.salePrice,
        })),
      };
    }),

  /**
   * Get featured categories for homepage with product counts
   */
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).optional().default(6) }))
    .query(async ({ input }) => {
      const siteConfigRepo = container.getSiteConfigRepository();
      const categoryRepo = container.getCategoryRepository();
      const productRepo = container.getProductRepository();

      // Get featured items of type 'category'
      const featuredItems = await siteConfigRepo.getFeaturedItemsByType(
        "homepage_categories",
        "category"
      );

      // Fetch actual categories with product counts
      const categories = await Promise.all(
        featuredItems.slice(0, input.limit).map(async (item) => {
          const category = await categoryRepo.findById(item.itemId);
          if (!category || !category.isActive) return null;

          // Get product count for this category
          const products = await productRepo.findAll({
            isActive: true,
            categoryId: category.id,
          });

          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            imageUrl: category.imageUrl,
            productCount: products.length,
          };
        })
      );

      return categories.filter(Boolean);
    }),
});
