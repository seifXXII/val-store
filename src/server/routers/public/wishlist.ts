/**
 * Wishlist Router
 *
 * tRPC router for wishlist operations.
 * All procedures require authentication.
 */

import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { container } from "@/application/container";

export const wishlistRouter = router({
  /**
   * Get user's wishlist (returns array of wishlist items)
   */
  getMyWishlist: protectedProcedure.query(async ({ ctx }) => {
    const useCase = container.getGetWishlistUseCase();
    return useCase.execute(ctx.user.id);
  }),

  /**
   * Get wishlist item count (used for navbar badge)
   */
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const useCase = container.getGetWishlistUseCase();
    const items = await useCase.execute(ctx.user.id);
    return { count: items.length } as const;
  }),

  /**
   * Add product to wishlist
   */
  addToWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await container
        .getAddToWishlistUseCase()
        .execute(ctx.user.id, input.productId);
      return { success: true } as const;
    }),

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await container
        .getRemoveFromWishlistUseCase()
        .execute(ctx.user.id, input.productId);
      return { success: true } as const;
    }),

  /**
   * Check if a product is in wishlist
   */
  checkStatus: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const inWishlist = await container
        .getCheckWishlistStatusUseCase()
        .execute(ctx.user.id, input.productId);
      return { inWishlist } as const;
    }),
});
