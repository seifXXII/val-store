import { router, publicProcedure } from "../../trpc";
import { db } from "@/db";
import { orders, reviews, productVariants } from "@/db/schema";
import { sql, desc, gte } from "drizzle-orm";

export const dashboardRouter = router({
  // Get key metrics
  getMetrics: publicProcedure.query(async () => {
    // Get total revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [revenueResult] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo));

    // Get order count
    const [ordersResult] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orders);

    // Get low stock count (stock < 10)
    const [lowStockResult] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(productVariants)
      .where(sql`${productVariants.stockQuantity} < 10`);

    // Get pending reviews count
    const [reviewsResult] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(sql`${reviews.isApproved} = false`);

    return {
      revenue: parseFloat(revenueResult.total || "0"),
      orders: ordersResult.count || 0,
      lowStock: lowStockResult.count || 0,
      pendingReviews: reviewsResult.count || 0,
    };
  }),

  // Get sales trend for chart (last 30 days)
  getSalesTrend: publicProcedure.query(async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await db
      .select({
        date: sql<string>`DATE(${orders.createdAt})`,
        total: sql<string>`SUM(${orders.totalAmount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    return salesData.map((row) => ({
      date: row.date,
      revenue: parseFloat(row.total || "0"),
      orders: row.count,
    }));
  }),

  // Get recent orders
  getRecentOrders: publicProcedure.query(async () => {
    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: sql<string>`CONCAT('ORD-', ${orders.id})`,
        customerName: sql<string>`'Customer'`, // Will be replaced with actual user data
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return recentOrders;
  }),
});
