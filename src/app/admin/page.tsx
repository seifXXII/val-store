import { MetricsCards } from "@/components/admin/dashboard/MetricsCards";
import { SalesChart } from "@/components/admin/dashboard/SalesChart";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Key Metrics */}
      <MetricsCards />

      {/* Charts & Activities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
}
