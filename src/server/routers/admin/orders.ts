import { container } from "@/application/container";
import { z } from "zod";
import { router, publicProcedure } from "../../trpc";

/**
 * Orders Router - Thin Adapter
 *
 * Delegates all business logic to use cases.
 */

const listOrdersSchema = z
  .object({
    userId: z.string().optional(),
    status: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    minTotal: z.number().optional(),
    maxTotal: z.number().optional(),
  })
  .optional();

const getOrderSchema = z.object({
  id: z.string().uuid(),
});

const updateOrderStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
});

export const ordersRouter = router({
  // List orders with filtering
  list: publicProcedure.input(listOrdersSchema).query(async ({ input }) => {
    const useCase = container.getListOrdersUseCase();
    return useCase.execute(input || {});
  }),

  // Get single order by ID
  getById: publicProcedure.input(getOrderSchema).query(async ({ input }) => {
    const useCase = container.getGetOrderUseCase();
    return useCase.execute(input);
  }),

  // Update order status
  updateStatus: publicProcedure
    .input(updateOrderStatusSchema)
    .mutation(async ({ input }) => {
      const useCase = container.getUpdateOrderStatusUseCase();
      return useCase.execute(input);
    }),
});
