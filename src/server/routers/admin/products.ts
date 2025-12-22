import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { container } from "@/application/container";

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  description: z.string(),
  categoryId: z.string().uuid(),
  basePrice: z.number().positive(),
  salePrice: z.number().positive().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

const listProductsSchema = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export const productsRouter = router({
  // List all products
  list: publicProcedure
    .input(listProductsSchema.optional())
    .query(async ({ input }) => {
      const useCase = container.getListProductsUseCase();
      return useCase.execute(input || {});
    }),

  // Get single product by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const useCase = container.getGetProductUseCase();
      return useCase.execute({ id: input.id });
    }),

  // Get product by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const useCase = container.getGetProductUseCase();
      return useCase.execute({ slug: input.slug });
    }),

  // Create new product
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const useCase = container.getCreateProductUseCase();
      return useCase.execute(input);
    }),

  // Update product (simplified for now - TODO: create UpdateProductUseCase)
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: createProductSchema.partial(),
      })
    )
    .mutation(async () => {
      // TODO: Implement UpdateProductUseCase
      throw new Error("Update use case not implemented yet");
    }),

  // Delete product
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const useCase = container.getDeleteProductUseCase();
      return useCase.execute(input);
    }),

  // Toggle product status
  toggleStatus: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const useCase = container.getToggleProductStatusUseCase();
      return useCase.execute(input);
    }),
});
