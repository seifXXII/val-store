"use client";

/**
 * Admin Analytics Page
 *
 * Revenue trends, top products, order status breakdown, and CSV export.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Download,
  Package,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Period = 7 | 30 | 90;

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  paid: "#22c55e",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
  refunded: "#6b7280",
};

export default function AnalyticsPage() {
  const [days, setDays] = useState<Period>(30);

  const { data, isLoading } = trpc.admin.dashboard.getAnalytics.useQuery({
    days,
  });

  const handleExportCSV = () => {
    if (!data) return;

    const rows = [
      ["Metric", "Value"],
      ["Period", `Last ${days} days`],
      ["Total Revenue", `$${data.totalRevenue.toFixed(2)}`],
      ["Total Orders", String(data.totalOrders)],
      ["Avg Order Value", `$${data.avgOrderValue.toFixed(2)}`],
      ["Total Customers", String(data.totalCustomers)],
      [""],
      ["Date", "Revenue", "Orders"],
      ...data.revenueTrend.map((d) => [
        d.date,
        `$${d.revenue.toFixed(2)}`,
        String(d.orders),
      ]),
      [""],
      ["Product", "Qty Sold", "Revenue"],
      ...data.topProducts.map((p) => [
        p.productName,
        String(p.totalQuantity),
        `$${p.totalRevenue.toFixed(2)}`,
      ]),
      [""],
      ["Status", "Count"],
      ...data.ordersByStatus.map((s) => [s.status, String(s.count)]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${days}d-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Track your store performance and key metrics.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {([7, 30, 90] as Period[]).map((p) => (
            <Button
              key={p}
              variant={days === p ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(p)}
            >
              {p}d
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={!data || isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Revenue"
              value={`$${data.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={DollarSign}
              description={`Last ${days} days`}
            />
            <KPICard
              title="Total Orders"
              value={String(data.totalOrders)}
              icon={ShoppingCart}
              description={`Last ${days} days`}
            />
            <KPICard
              title="Avg Order Value"
              value={`$${data.avgOrderValue.toFixed(2)}`}
              icon={TrendingUp}
              description={`Last ${days} days`}
            />
            <KPICard
              title="Customers"
              value={String(data.totalCustomers)}
              icon={Users}
              description={`Unique customers`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Revenue Trend */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {data.revenueTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={data.revenueTrend.map((item) => ({
                        date: new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        }),
                        revenue: item.revenue,
                        orders: item.orders,
                      }))}
                    >
                      <defs>
                        <linearGradient
                          id="analyticsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 12,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 12,
                        }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [
                          `$${value.toFixed(2)}`,
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#analyticsGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No revenue data for this period
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Status Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                {data.ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.ordersByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="status"
                        label={({ status, count }) => `${status}: ${count}`}
                        labelLine={false}
                      >
                        {data.ordersByStatus.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={STATUS_COLORS[entry.status] || "#6b7280"}
                          />
                        ))}
                      </Pie>
                      <Legend
                        formatter={(value: string) =>
                          value.charAt(0).toUpperCase() + value.slice(1)
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No orders for this period
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {data.topProducts.map((product, index) => (
                    <div
                      key={product.productId || index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">
                            {product.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.totalQuantity} units sold
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">
                        ${product.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No product sales data for this period
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

/** Reusable KPI card */
function KPICard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
