import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const ordersRouter = router({
  // List all orders
  list: publicProcedure.query(async () => {
    const ordersList = await db
      .select({
        id: orders.id,
        orderNumber: sql<string>`CONCAT('ORD-', LPAD(CAST(ROW_NUMBER() OVER (ORDER BY ${orders.createdAt}) AS TEXT), 4, '0'))`,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        // Count items
        itemsCount: sql<number>`(
          SELECT COUNT(*)
          FROM ${orderItems}
          WHERE ${orderItems.orderId} = ${orders.id}
        )`,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt));

    return ordersList;
  }),

  // Get single order by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const order = await db.query.orders.findFirst({
        where: eq(orders.id, input.id),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    }),

  // Update order status
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum([
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "refunded",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id))
        .returning();

      return updated;
    }),
});
