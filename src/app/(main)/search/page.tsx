/**
 * Search Page
 *
 * Client-side search results with infinite scroll.
 * Redirects to search prompt if no query.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { InfiniteSearchGrid } from "@/components/products/InfiniteSearchGrid";
import { Search } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

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

  return <InfiniteSearchGrid query={query} />;
}
