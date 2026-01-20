/**
 * New Arrivals Collection Page
 *
 * Uses InfiniteProductGrid with isFeatured filter.
 */

import { InfiniteProductGrid } from "@/components/products/InfiniteProductGrid";

export default function CollectionsNewPage() {
  return (
    <InfiniteProductGrid
      isFeatured
      title="New Arrivals"
      description="The latest additions to our premium collection."
    />
  );
}
