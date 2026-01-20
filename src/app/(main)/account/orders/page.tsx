"use client";

/**
 * Orders List Page
 *
 * Display user's order history with infinite scroll.
 */

import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.public.orders.getMyOrders.useInfiniteQuery(
      { limit: ITEMS_PER_PAGE },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.page < lastPage.totalPages) {
            return lastPage.page + 1;
          }
          return undefined;
        },
        initialCursor: 1,
      }
    );

  // Flatten all pages
  const orders = data?.pages.flatMap((page) => page.orders) || [];
  const total = data?.pages[0]?.total || 0;

  // Infinite scroll
  const { ref: sentinelRef } = useInfiniteScroll({
    onLoadMore: () => fetchNextPage(),
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <Link href="/" className="text-primary hover:underline">
            Start shopping
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order History</h2>
        <p className="text-muted-foreground">
          View and track your past orders. Showing {orders.length} of {total}.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/account/orders/${order.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(-8)}
                  </CardTitle>
                  <Badge className={statusColors[order.status] || ""}>
                    {order.status}
                  </Badge>
                </div>
                <CardDescription>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                    </p>
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-4"
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <span className="text-sm text-muted-foreground">
              Scroll for more...
            </span>
          )}
        </div>
      )}

      {/* End of list */}
      {!hasNextPage && orders.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          You&apos;ve reached the end
        </p>
      )}
    </div>
  );
}
