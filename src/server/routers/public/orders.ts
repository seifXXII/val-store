/**
 * Orders Router (Public/Customer)
 *
 * tRPC router for customer order operations.
 * All procedures require authentication.
 */

import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { container } from "@/application/container";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { orders, payments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const ordersRouter = router({
  /**
   * Get current user's orders
   */
  getMyOrders: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional().default(10),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const orderRepository = container.getOrderRepository();
      const recentOrders = await orderRepository.findRecentByUserId(
        ctx.user.id,
        input?.limit
      );

      return recentOrders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.totalAmount,
        itemCount: order.items.length,
        createdAt: order.createdAt,
      }));
    }),

  /**
   * Get a specific order by ID (must belong to current user)
   */
  getOrderById: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const orderRepository = container.getOrderRepository();
      const order = await orderRepository.findById(input.orderId);

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // Ensure order belongs to current user
      if (order.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      return {
        id: order.id,
        status: order.status,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        shippingCost: order.shippingCost,
        total: order.totalAmount,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
      };
    }),

  /**
   * Get order number for the current user by order id (for checkout success page)
   */
  getOrderNumberById: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const row = await db.query.orders.findFirst({
        where: and(
          eq(orders.id, input.orderId),
          eq(orders.userId, ctx.user.id)
        ),
        columns: {
          id: true,
          orderNumber: true,
        },
      });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return {
        orderId: row.id,
        orderNumber: row.orderNumber,
      };
    }),

  /**
   * Get order number for the current user by Stripe checkout session id.
   * We store the Stripe session id in payments.transactionId at session creation time.
   */
  getOrderNumberByStripeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const row = await db
        .select({
          orderId: orders.id,
          orderNumber: orders.orderNumber,
        })
        .from(payments)
        .innerJoin(orders, eq(payments.orderId, orders.id))
        .where(
          and(
            eq(payments.transactionId, input.sessionId),
            eq(orders.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!row[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return row[0];
    }),
});
