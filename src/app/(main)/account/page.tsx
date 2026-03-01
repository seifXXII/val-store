"use client";

/**
 * Account Dashboard Page
 *
 * Overview of customer account with quick links and stats.
 */

import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { AccountWelcome } from "@/components/account/dashboard/AccountWelcome";
import { AccountQuickLinks } from "@/components/account/dashboard/AccountQuickLinks";
import { AccountRecentOrders } from "@/components/account/dashboard/AccountRecentOrders";

export default function AccountDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  // Fetch recent orders
  const { data: ordersData } = trpc.public.orders.getMyOrders.useQuery(
    { limit: 3 },
    { enabled: !!user }
  );
  const recentOrders = ordersData?.orders;

  return (
    <div className="space-y-6">
      <AccountWelcome userName={user?.name} />
      <AccountQuickLinks ordersTotal={ordersData?.total ?? 0} />
      <AccountRecentOrders recentOrders={recentOrders} />
    </div>
  );
}
