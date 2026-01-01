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
   * Get user's wishlist
   */
  getMyWishlist: protectedProcedure.query(async ({ ctx }) => {
    const useCase = container.getGetWishlistUseCase();
    return useCase.execute(ctx.user.id);
  }),

  /**
   * Add product to wishlist
   */
  addToWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const useCase = container.getAddToWishlistUseCase();
      await useCase.execute(ctx.user.id, input.productId);
      return { success: true };
    }),

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const useCase = container.getRemoveFromWishlistUseCase();
      await useCase.execute(ctx.user.id, input.productId);
      return { success: true };
    }),

  /**
   * Check if product is in wishlist
   */
  checkStatus: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const useCase = container.getCheckWishlistStatusUseCase();
      return useCase.execute(ctx.user.id, input.productId);
    }),
});
