/**
 * Search Page (Server Component)
 *
 * Searches products by name and description using cached queries.
 * Gets search query from URL search params.
 */

import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { container } from "@/application/container";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;

  // If no query, show search prompt
  if (!query || query.trim() === "") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <Search className="h-16 w-16 text-gray-400 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Search Products</h1>
        <p className="text-gray-400 text-center max-w-md">
          Use the search bar in the navigation to find products by name or
          description.
        </p>
      </div>
    );
  }

  // Search products in database
  const repo = container.getProductRepository();
  const allProducts = await repo.findAll({ isActive: true });

  // Simple search - filter by name/description containing query
  const searchQuery = query.toLowerCase();
  const results = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery) ||
      (p.description && p.description.toLowerCase().includes(searchQuery))
  );

  // Transform to format expected by CollectionPageLayout
  const productsForLayout = results.slice(0, 50).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.basePrice,
    salePrice: p.salePrice ?? undefined,
    isOnSale: p.salePrice !== null && p.salePrice < p.basePrice,
  }));

  // Empty state
  if (productsForLayout.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <Search className="h-16 w-16 text-gray-400 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">No Results Found</h1>
        <p className="text-gray-400 text-center max-w-md mb-6">
          We couldn&apos;t find any products matching &quot;{query}&quot;. Try a
          different search term.
        </p>
        <Link href="/collections/all" className="text-primary hover:underline">
          Browse all products →
        </Link>
      </div>
    );
  }

  return (
    <CollectionPageLayout
      title={`Search: "${query}"`}
      description={`Found ${productsForLayout.length} product${productsForLayout.length === 1 ? "" : "s"} matching your search.`}
      products={productsForLayout}
    />
  );
}
