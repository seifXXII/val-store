/**
 * All Products Collection Page
 *
 * Uses client-side infinite scroll for product browsing.
 */

import { InfiniteProductGrid } from "@/components/products/InfiniteProductGrid";

export default function CollectionsAllPage() {
  return (
    <InfiniteProductGrid
      title="All Products"
      description="Browse our complete collection of premium streetwear essentials."
    />
  );
}
