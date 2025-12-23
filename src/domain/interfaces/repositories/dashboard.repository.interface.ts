/**
 * Dashboard Repository Interface
 *
 * Defines contracts for dashboard metrics queries.
 * Implementation should be in infrastructure layer.
 */

export interface DashboardMetrics {
  revenue: number;
  orders: number;
  lowStock: number;
  pendingReviews: number;
}

export interface SalesTrendItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: string;
  createdAt: Date;
}

export interface DashboardRepositoryInterface {
  /**
   * Get key metrics for the dashboard (last 30 days)
   */
  getMetrics(): Promise<DashboardMetrics>;

  /**
   * Get sales trend data for charts (last 30 days)
   */
  getSalesTrend(): Promise<SalesTrendItem[]>;

  /**
   * Get recent orders for the dashboard
   */
  getRecentOrders(limit?: number): Promise<RecentOrder[]>;
}
