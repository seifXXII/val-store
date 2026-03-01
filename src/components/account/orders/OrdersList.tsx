import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { AppRouter } from "@/server";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type OrdersListType =
  RouterOutputs["public"]["orders"]["getMyOrders"]["orders"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  processing: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  shipped: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  delivered: "bg-green-500/15 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};

interface OrdersListProps {
  orders: OrdersListType;
  total: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: (node: HTMLElement | null) => void;
}

export function OrdersList({
  orders,
  total,
  hasNextPage,
  isFetchingNextPage,
  sentinelRef,
}: OrdersListProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Order History</h2>
        <p className="text-gray-400">
          View and track your past orders. Showing {orders.length} of {total}.
        </p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} href={`/account/orders/${order.id}`}>
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-white">
                  Order #{order.id.slice(-8)}
                </h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    statusColors[order.status] || "bg-white/10 text-gray-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-white">
                    ${order.total.toFixed(2)}
                  </p>
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
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
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          ) : (
            <span className="text-sm text-gray-500">Scroll for more...</span>
          )}
        </div>
      )}

      {/* End of list */}
      {!hasNextPage && orders.length > 0 && (
        <p className="text-center text-sm text-gray-500 py-4">
          You&apos;ve reached the end
        </p>
      )}
    </div>
  );
}
