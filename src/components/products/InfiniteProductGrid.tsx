"use client";

/**
 * Infinite Product Grid Component
 *
 * Client-side component that displays products with infinite scroll.
 * Uses tRPC useInfiniteQuery for pagination.
 */

import { trpc } from "@/lib/trpc";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";

interface InfiniteProductGridProps {
  categoryId?: string;
  gender?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  title?: string;
  description?: string;
}

const ITEMS_PER_PAGE = 12;

export function InfiniteProductGrid({
  categoryId,
  gender,
  isFeatured,
  isOnSale,
  title = "All Products",
  description,
}: InfiniteProductGridProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.public.products.list.useInfiniteQuery(
      { limit: ITEMS_PER_PAGE, categoryId, gender, isFeatured, isOnSale },
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
  const products = data?.pages.flatMap((page) => page.products) || [];
  const total = data?.pages[0]?.total || 0;

  // Infinite scroll
  const { ref: sentinelRef } = useInfiniteScroll({
    onLoadMore: () => fetchNextPage(),
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
        <p className="text-sm text-muted-foreground mt-2">
          Showing {products.length} of {total} products
        </p>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.basePrice}
              salePrice={product.salePrice ?? undefined}
              isOnSale={
                product.salePrice !== null &&
                product.salePrice < product.basePrice
              }
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-8"
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
      {!hasNextPage && products.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          You&apos;ve reached the end
        </p>
      )}
    </div>
  );
}
