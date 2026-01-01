/**
 * Checkout Router
 *
 * tRPC router for checkout and payment operations.
 * All procedures require authentication (protectedProcedure).
 */

import { router, protectedProcedure } from "../../trpc";
import { container } from "@/application/container";

export const checkoutRouter = router({
  /**
   * Create a Stripe Checkout Session
   */
  createSession: protectedProcedure.mutation(async ({ ctx }) => {
    const useCase = container.getCreateCheckoutSessionUseCase();
    return useCase.execute({
      userId: ctx.user.id,
      email: ctx.user.email,
    });
  }),
});
