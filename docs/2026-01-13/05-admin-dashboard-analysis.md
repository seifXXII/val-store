# Admin Dashboard Analysis

**Last updated:** 2026-01-13

This document focuses on the admin dashboard UI components and their tRPC/data dependencies.

## 1) Dashboard page composition

- Dashboard route: `src/app/(admin)/dashboard/page.tsx`
  - `MetricsCards`
  - `SalesChart`
  - `RecentOrders`

## 2) MetricsCards

- File: `src/components/admin/dashboard/MetricsCards.tsx`
- Data: `trpc.admin.dashboard.getMetrics.useQuery()`
- UI:
  - Displays 4 cards (Revenue, Orders, Low Stock, Pending Reviews)

**Notes / potential issues**

- The “change” fields are currently hardcoded strings (not computed).
- The data type assumed:
  - `metrics.revenue` is a number (uses `.toFixed(2)`)
  - `orders`, `lowStock`, `pendingReviews` are numbers

## 3) SalesChart

- File: `src/components/admin/dashboard/SalesChart.tsx`
- Data: `trpc.admin.dashboard.getSalesTrend.useQuery()`
- Uses `recharts` AreaChart.

**Notes / potential issues**

- The tRPC query does not accept period input; the component slices client-side.
- Trend calc compares last 7 days vs previous 7 days _within the filtered set_.
  - For `7d` period there isn’t enough historical data to compute a “previous 7 days”. It returns 0%. That may be fine but is slightly misleading.

## 4) RecentOrders

- File: `src/components/admin/dashboard/RecentOrders.tsx`
- Data: `trpc.admin.dashboard.getRecentOrders.useQuery()`
- Links:
  - “View All” links to `/orders`.
  - Each row links to `/orders/[id]`.

**Notes / potential issues**

- Routing: There is no confirmed admin order detail route in `src/app/(admin)/orders/[id]/...` yet.
  - If missing, both “View All” and per-order links should be reconsidered under `/dashboard/orders` or similar.
- `totalAmount` is parsed as string: `parseFloat(order.totalAmount).toFixed(2)`.
  - In other parts of the code totals are numbers. This inconsistency is a source of bugs.

## 5) Dashboard router

- File: `src/server/routers/admin/dashboard.ts`
- Endpoints:
  - `getMetrics` → `GetDashboardMetricsUseCase`
  - `getSalesTrend` → `GetSalesTrendUseCase`
  - `getRecentOrders` → `GetRecentOrdersUseCase`

**Key dependency:** if orders are not being created from Stripe payments, dashboard metrics/trends/recent orders will remain empty.

## 6) Follow-ups

- Align admin routes and middleware protection.
- Standardize numeric types for money values across all admin endpoints.
- Decide whether “period” should be a server parameter to avoid overfetching.
