import { router, adminProcedure } from "../../trpc";
import { container } from "@/application/container";

/**
 * Dashboard Router - Admin Dashboard Metrics
 *
 * Refactored to follow Onion Architecture:
 * - No direct DB queries
 * - Delegates to use cases via DI container
 * - Protected with admin-only access
 */

export const dashboardRouter = router({
  // Get key metrics
  getMetrics: adminProcedure.query(async () => {
    const useCase = container.getGetDashboardMetricsUseCase();
    return useCase.execute();
  }),

  // Get sales trend for chart (last 30 days)
  getSalesTrend: adminProcedure.query(async () => {
    const useCase = container.getGetSalesTrendUseCase();
    return useCase.execute();
  }),

  // Get recent orders
  getRecentOrders: adminProcedure.query(async () => {
    const useCase = container.getGetRecentOrdersUseCase();
    return useCase.execute();
  }),
});
