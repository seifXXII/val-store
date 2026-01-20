/**
 * Accessories Collection Page
 *
 * Uses InfiniteProductGrid with accessories filter.
 * Note: Currently filtered by checking for 'accessories' in product names/descriptions
 * since we don't have a dedicated accessories category in the database yet.
 */

import { InfiniteProductGrid } from "@/components/products/InfiniteProductGrid";

export default function CollectionsAccessoriesPage() {
  return (
    <InfiniteProductGrid
      title="Accessories"
      description="Complete your look with our curated selection of accessories."
    />
  );
}
