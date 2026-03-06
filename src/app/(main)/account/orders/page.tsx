"use client";

/**
 * Orders List Page
 *
 * Display user's order history with infinite scroll.
 */

import { trpc } from "@/lib/trpc";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { OrdersLoading } from "@/components/account/orders/OrdersLoading";
import { OrdersEmpty } from "@/components/account/orders/OrdersEmpty";
import { OrdersList } from "@/components/account/orders/OrdersList";

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

  if (isLoading) return <OrdersLoading />;
  if (!orders || orders.length === 0) return <OrdersEmpty />;

  return (
    <OrdersList
      orders={orders}
      total={total}
      hasNextPage={!!hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      sentinelRef={sentinelRef}
    />
  );
}
