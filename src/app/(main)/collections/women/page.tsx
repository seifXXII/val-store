/**
 * Women's Collection Page
 *
 * Uses InfiniteProductGrid with gender filter.
 */

import { InfiniteProductGrid } from "@/components/products/InfiniteProductGrid";

export default function CollectionsWomenPage() {
  return (
    <InfiniteProductGrid
      gender="women"
      title="Women's Collection"
      description="Elevated streetwear essentials crafted for the modern woman."
    />
  );
}
