"use client";

/**
 * Account Dashboard Page
 *
 * Overview of customer account with quick links and stats.
 */

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Package, MapPin, Heart, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function AccountDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  // Fetch recent orders
  const { data: recentOrders } = trpc.public.orders.getMyOrders.useQuery(
    { limit: 3 },
    { enabled: !!user }
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || "there"}!
        </h2>
        <p className="text-muted-foreground">
          Manage your orders, addresses, and preferences.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickLinkCard
          href="/account/orders"
          icon={Package}
          label="Orders"
          value={recentOrders?.length ?? 0}
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
          href="/wishlist"
          icon={Heart}
          label="Wishlist"
          value="View"
          description="Saved items"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/orders">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">Order #{order.id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No orders yet.{" "}
              <Link href="/" className="text-primary hover:underline">
                Start shopping
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
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
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
