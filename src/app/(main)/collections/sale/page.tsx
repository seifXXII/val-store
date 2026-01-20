/**
 * Sale Collection Page
 *
 * Uses InfiniteProductGrid with isOnSale filter.
 */

import { InfiniteProductGrid } from "@/components/products/InfiniteProductGrid";

export default function CollectionsSalePage() {
  return (
    <InfiniteProductGrid
      isOnSale
      title="Sale"
      description="Don't miss out on these limited-time offers."
    />
  );
}
