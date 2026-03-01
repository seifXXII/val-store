"use client";

import { useSearchParams } from "next/navigation";
import { InfiniteSearchGrid } from "@/components/products/InfiniteSearchGrid";
import { SearchEmptyPrompt } from "@/components/search/SearchEmptyPrompt";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  // If no query, show search prompt
  if (!query || query.trim() === "") {
    return <SearchEmptyPrompt />;
  }

  return <InfiniteSearchGrid query={query} />;
}
