/**
 * Public Products Router
 *
 * Public endpoints for storefront product data.
 * All endpoints use publicProcedure (no auth required).
 * Returns only active products with filtered data (no cost/admin info).
 */

import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { container } from "@/application/container";

export const publicProductsRouter = router({
  /**
   * List active products for storefront
   */
  list: publicProcedure
    .input(
      z
        .object({
          categoryId: z.string().uuid().optional(),
          limit: z.number().min(1).max(50).optional().default(20),
          offset: z.number().min(0).optional().default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const repo = container.getProductRepository();
      const products = await repo.findAll({
        isActive: true,
        categoryId: input?.categoryId,
      });

      // Return only public-safe data
      return products
        .slice(input?.offset ?? 0, (input?.offset ?? 0) + (input?.limit ?? 20))
        .map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          basePrice: p.basePrice,
          salePrice: p.salePrice,
          categoryId: p.categoryId,
          gender: p.gender,
          isFeatured: p.isFeatured,
          // Note: costPrice, sku, and other admin fields are NOT included
        }));
    }),

  /**
   * Get product by slug (public detail page)
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const repo = container.getProductRepository();
      const product = await repo.findBySlug(input.slug);

      if (!product || !product.isActive) {
        return null;
      }

      // Get images and variants
      const imageRepo = container.getProductImageRepository();
      const variantRepo = container.getProductVariantRepository();

      const images = await imageRepo.findByProduct(product.id);
      const variants = await variantRepo.findByProduct(product.id);

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        categoryId: product.categoryId,
        gender: product.gender,
        material: product.material,
        careInstructions: product.careInstructions,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        images: images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
        })),
        variants: variants
          .filter((v) => v.isAvailable)
          .map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            priceAdjustment: v.priceAdjustment,
            inStock: v.stockQuantity > 0,
            // Note: actual stockQuantity is NOT exposed
          })),
      };
    }),

  /**
   * Get featured products for homepage
   */
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).optional().default(8) }))
    .query(async ({ input }) => {
      const repo = container.getProductRepository();
      const products = await repo.findAll({
        isActive: true,
        isFeatured: true,
      });

      return products.slice(0, input.limit).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
      }));
    }),

  /**
   * Search products
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).optional().default(20),
      })
    )
    .query(async ({ input }) => {
      const repo = container.getProductRepository();
      const allProducts = await repo.findAll({ isActive: true });

      // Simple search - filter by name/description containing query
      const query = input.query.toLowerCase();
      const results = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );

      return results.slice(0, input.limit).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
      }));
    }),
});
