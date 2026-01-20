/**
 * Men's Collection Page
 *
 * Uses InfiniteProductGrid with gender filter.
 */

import { InfiniteProductGrid } from "@/components/products/InfiniteProductGrid";

export default function CollectionsMenPage() {
  return (
    <InfiniteProductGrid
      gender="men"
      title="Men's Collection"
      description="Premium streetwear essentials designed for the modern man."
    />
  );
}
