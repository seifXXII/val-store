/**
 * Admin Customers Router
 *
 * List registered users and their order history.
 */

import { router, adminProcedure } from "@/server/trpc";
import { z } from "zod/v4";
import { db } from "@/db";
import { user, orders } from "@/db/schema";
import { eq, desc, count, sum, ilike, or } from "drizzle-orm";

export const adminCustomersRouter = router({
  /**
   * List all customers (users) with order stats
   */
  list: adminProcedure
    .input(
      z
        .object({
          limit: z.number().int().positive().max(100).optional(),
          offset: z.number().int().min(0).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      const search = input?.search?.trim();

      // Get users with order counts
      let query = db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          orderCount: count(orders.id),
          totalSpent: sum(orders.totalAmount),
        })
        .from(user)
        .leftJoin(orders, eq(user.id, orders.userId))
        .groupBy(user.id)
        .orderBy(desc(user.createdAt))
        .limit(limit)
        .offset(offset);

      if (search) {
        query = query.where(
          or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
        ) as typeof query;
      }

      const customers = await query;

      // Get total count
      const [{ total }] = await db.select({ total: count() }).from(user);

      return {
        customers: customers.map((c) => ({
          ...c,
          orderCount: Number(c.orderCount),
          totalSpent: c.totalSpent ? parseFloat(c.totalSpent) : 0,
        })),
        total,
      };
    }),

  /**
   * Get customer details with orders
   */
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const customer = await db.query.user.findFirst({
        where: eq(user.id, input.id),
      });

      if (!customer) return null;

      const customerOrders = await db.query.orders.findMany({
        where: eq(orders.userId, input.id),
        orderBy: [desc(orders.createdAt)],
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });

      // Calculate stats
      const orderCount = customerOrders.length;
      const totalSpent = customerOrders.reduce(
        (sum, o) => sum + parseFloat(o.totalAmount),
        0
      );

      return {
        ...customer,
        orderCount,
        totalSpent,
        orders: customerOrders,
      };
    }),

  /**
   * Get customer count
   */
  getCount: adminProcedure.query(async () => {
    const [{ total }] = await db.select({ total: count() }).from(user);
    return total;
  }),
});
