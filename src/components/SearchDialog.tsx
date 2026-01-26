"use client";

/**
 * Search Dialog
 *
 * Global search dialog triggered by Cmd/Ctrl+K or clicking search icon.
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = trpc.public.products.search.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Reset query when dialog closes - handle in onOpenChange callback
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setQuery("");
      }
      onOpenChange(open);
    },
    [onOpenChange]
  );

  // Navigate to product
  const handleSelect = useCallback(
    (slug: string) => {
      onOpenChange(false);
      router.push(`/products/${slug}`);
    },
    [onOpenChange, router]
  );

  // Navigate to search results page
  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      onOpenChange(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, onOpenChange, router]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Visually hidden title for screen reader accessibility */}
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        {/* Search Input */}
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleViewAll();
              }
            }}
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {debouncedQuery.length < 2 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : !data?.products.length ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No products found for &ldquo;{debouncedQuery}&rdquo;
            </div>
          ) : (
            <>
              <div className="p-2">
                {data.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.slug)}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <div className="relative h-12 w-12 bg-muted rounded-md overflow-hidden shrink-0">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        {product.salePrice ? (
                          <>
                            <span className="text-green-600">
                              $
                              {parseFloat(String(product.salePrice)).toFixed(2)}
                            </span>
                            <span className="text-muted-foreground line-through text-xs">
                              $
                              {parseFloat(String(product.basePrice)).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span>
                            ${parseFloat(String(product.basePrice)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {data.total > data.products.length && (
                <div className="border-t p-2">
                  <button
                    onClick={handleViewAll}
                    className="w-full py-2 text-sm text-primary hover:underline"
                  >
                    View all {data.total} results →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t px-3 py-2 text-xs text-muted-foreground flex gap-4">
          <span>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
              Enter
            </kbd>{" "}
            to search
          </span>
          <span>
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
              Esc
            </kbd>{" "}
            to close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook for global Cmd/Ctrl+K shortcut
 */
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);
}
