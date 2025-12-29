"use client";

/**
 * Dynamic Featured Categories
 *
 * Fetches featured categories from public API.
 */

import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

interface DynamicFeaturedCategoriesProps {
  title?: string;
  subtitle?: string;
}

function CategoryCard({
  name,
  slug,
  productCount,
}: {
  name: string;
  slug: string;
  productCount?: number;
}) {
  return (
    <Link
      href={`/collections/${slug}`}
      className="group relative block overflow-hidden"
    >
      {/* Image container with aspect ratio */}
      <div className="relative aspect-[3/4] bg-val-steel overflow-hidden">
        {/* Placeholder gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 transition-transform duration-500 group-hover:scale-105" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/50" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {name}
          </h3>
          {productCount !== undefined && productCount > 0 && (
            <p className="text-sm text-gray-300">{productCount} items</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function DynamicFeaturedCategories({
  title = "Shop by Category",
  subtitle = "Find your perfect style",
}: DynamicFeaturedCategoriesProps) {
  // Fetch featured categories from public API
  const { data: categories, isLoading } =
    trpc.public.categories.getFeatured.useQuery(
      { limit: 6 },
      { staleTime: 1000 * 60 * 5 } // Cache for 5 minutes
    );

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-3" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {title}
          </h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories
            .filter(
              (category): category is NonNullable<typeof category> =>
                category !== null
            )
            .map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                productCount={category.productCount}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
