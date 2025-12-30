"use client";

import { useState } from "react";
import { ChevronDown, Grid3X3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProductCard,
  ProductCardProps,
} from "@/components/products/ProductCard";

interface CollectionPageLayoutProps {
  title: string;
  description?: string;
  products: ProductCardProps[];
  showFilters?: boolean;
}

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function CollectionPageLayout({
  title,
  description,
  products,
  showFilters = true,
}: CollectionPageLayoutProps) {
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const selectedSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || "Featured";

  return (
    <div className="min-h-screen bg-black">
      {/* Collection Header */}
      <div className="py-12 md:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      {showFilters && (
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Filters - placeholder */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Filters
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Sort & Grid Toggle */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Sort: {selectedSortLabel}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showSortDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-val-steel border border-white/10 rounded-md shadow-lg z-20">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                            sortBy === option.value
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grid Toggle (desktop only) */}
                <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-4">
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-2 rounded transition-colors ${
                      gridCols === 3
                        ? "text-white"
                        : "text-gray-500 hover:text-white"
                    }`}
                    aria-label="3 columns"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`p-2 rounded transition-colors ${
                      gridCols === 4
                        ? "text-white"
                        : "text-gray-500 hover:text-white"
                    }`}
                    aria-label="4 columns"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {products.length > 0 ? (
          <div
            className={`grid gap-4 md:gap-6 ${
              gridCols === 3
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-4"
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No products found</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for new arrivals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
