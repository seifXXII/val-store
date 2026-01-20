/**
 * All Products Collection Page (Server Component)
 *
 * Fetches all active products from the database.
 */

import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { getCachedAllProducts } from "@/lib/cache";

export default async function CollectionsAllPage() {
  // Fetch all products from database (cached)
  const products = await getCachedAllProducts(50);

  // Transform to format expected by CollectionPageLayout
  const productsForLayout = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.basePrice,
    salePrice: p.salePrice ?? undefined,
    isOnSale: p.salePrice !== null && p.salePrice < p.basePrice,
    isFeatured: p.isFeatured,
  }));

  return (
    <CollectionPageLayout
      title="All Products"
      description="Browse our complete collection of premium streetwear essentials."
      products={productsForLayout}
    />
  );
}
