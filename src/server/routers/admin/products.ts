import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { db } from "@/db";
import { products, productVariants, categories } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  description: z.string(),
  categoryId: z.string().uuid(),
  gender: z.enum(["men", "women", "unisex", "kids"]),
  basePrice: z.string(), // Stored as decimal string
  salePrice: z.string().optional(),
  costPrice: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        size: z.string(),
        color: z.string(),
        stockQuantity: z.number().int().min(0),
        sku: z.string(),
      })
    )
    .optional(),
});

export const productsRouter = router({
  // List all products
  list: publicProcedure.query(async () => {
    const productsList = await db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        basePrice: products.basePrice,
        isActive: products.isActive,
        createdAt: products.createdAt,
        categoryName: categories.name,
        // Get total stock from variants
        totalStock: sql<number>`(
          SELECT COALESCE(SUM(${productVariants.stockQuantity}), 0)
          FROM ${productVariants}
          WHERE ${productVariants.productId} = ${products.id}
        )`.as("total_stock"),
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    return productsList;
  }),

  // Get single product by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: eq(products.id, input.id),
        with: {
          variants: true,
          images: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    }),

  // Create new product
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const { variants, ...productData } = input;

      // Create product
      const [newProduct] = await db
        .insert(products)
        .values(productData)
        .returning();

      // Create variants if provided
      if (variants && variants.length > 0) {
        await db.insert(productVariants).values(
          variants.map((variant) => ({
            ...variant,
            productId: newProduct.id,
          }))
        );
      }

      return newProduct;
    }),

  // Update product
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: createProductSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const { variants, ...productData } = input.data;

      // Update product
      const [updated] = await db
        .update(products)
        .set(productData)
        .where(eq(products.id, input.id))
        .returning();

      // If variants provided, delete old ones and create new
      if (variants) {
        await db
          .delete(productVariants)
          .where(eq(productVariants.productId, input.id));

        if (variants.length > 0) {
          await db.insert(productVariants).values(
            variants.map((variant) => ({
              ...variant,
              productId: input.id,
            }))
          );
        }
      }

      return updated;
    }),

  // Delete product
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  // Toggle product status
  toggleStatus: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: eq(products.id, input.id),
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const [updated] = await db
        .update(products)
        .set({ isActive: !product.isActive })
        .where(eq(products.id, input.id))
        .returning();

      return updated;
    }),
});
