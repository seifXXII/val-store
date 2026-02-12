"use client";

/**
 * Account Dashboard Page
 *
 * Overview of customer account with quick links and stats.
 */

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Package, MapPin, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-val-accent/15 to-val-accent/5 border border-val-accent/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name || "there"}!
        </h2>
        <p className="text-gray-400">
          Manage your orders, addresses, and preferences.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickLinkCard
          href="/account/orders"
          icon={Package}
          label="Orders"
          value={ordersData?.total ?? 0}
          description="View order history"
        />
        <QuickLinkCard
          href="/account/addresses"
          icon={MapPin}
          label="Addresses"
          value="Manage"
          description="Shipping addresses"
        />
        <QuickLinkCard
          href="/account/wishlist"
          icon={Heart}
          label="Wishlist"
          value="View"
          description="Saved items"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-400 hover:text-val-accent"
          >
            <Link href="/account/orders">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="p-5">
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">
                      Order #{order.id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {order.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No orders yet.{" "}
              <Link
                href="/collections/all"
                className="text-val-accent hover:underline"
              >
                Start shopping
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon: Icon,
  label,
  value,
  description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-val-accent/10 rounded-lg">
            <Icon className="h-5 w-5 text-val-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
