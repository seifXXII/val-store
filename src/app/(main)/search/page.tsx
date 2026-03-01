/**
 * Search Page
 *
 * Client-side search results with infinite scroll.
 * Redirects to search prompt if no query.
 */

import { Suspense } from "react";
import { SearchContent } from "@/components/search/SearchContent";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
