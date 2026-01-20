"use client";

import { trpc } from "@/lib/trpc";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

const statusColors: Record<
  OrderStatus,
  "secondary" | "default" | "outline" | "destructive"
> = {
  pending: "secondary",
  processing: "default",
  paid: "default",
  shipped: "outline",
  delivered: "default",
  cancelled: "destructive",
  refunded: "secondary",
};

const ITEMS_PER_PAGE = 10;

export function OrdersTable() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.admin.orders.list.useInfiniteQuery(
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
      <div className="rounded-md border p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Orders count */}
      <p className="text-sm text-muted-foreground">
        Showing {orders.length} of {total} orders
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{order.userId.slice(0, 8)}...</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.totalItems}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={order.isPaid ? "default" : "secondary"}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.status as OrderStatus]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No orders found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
          You&apos;ve reached the end of the list
        </p>
      )}
    </div>
  );
}
