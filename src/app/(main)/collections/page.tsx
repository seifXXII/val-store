"use client";

/**
 * Collections Landing Page
 *
 * Displays all collections as sections with product previews.
 * Each collection shows a header and a row of products from that category.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ProductCard } from "@/components/products/ProductCard";

const PREVIEW_LIMIT = 4;

const collections = [
  {
    title: "New Arrivals",
    description: "The latest additions to our premium collection.",
    href: "/collections/new",
    queryParams: { isFeatured: true as const },
  },
  {
    title: "Men's Collection",
    description: "Premium streetwear essentials designed for the modern man.",
    href: "/collections/men",
    queryParams: { gender: "men" as const },
  },
  {
    title: "Women's Collection",
    description: "Elevated streetwear essentials crafted for the modern woman.",
    href: "/collections/women",
    queryParams: { gender: "women" as const },
  },
  {
    title: "On Sale",
    description: "Don't miss out on these limited-time offers.",
    href: "/collections/sale",
    queryParams: { isOnSale: true as const },
  },
];

function CollectionSection({
  title,
  description,
  href,
  queryParams,
}: {
  title: string;
  description: string;
  href: string;
  queryParams: { gender?: string; isFeatured?: boolean; isOnSale?: boolean };
}) {
  const { data, isLoading } = trpc.public.products.list.useQuery({
    limit: PREVIEW_LIMIT,
    ...queryParams,
  });

  const products = data?.products ?? [];

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            {title}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        <Link
          href={href}
          className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors shrink-0"
        >
          View All
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(PREVIEW_LIMIT)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-3/4 bg-white/8 rounded-lg animate-pulse" />
              <div className="h-4 w-3/4 bg-white/8 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-white/8 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.basePrice}
              salePrice={product.salePrice ?? undefined}
              primaryImage={product.primaryImage ?? undefined}
              isOnSale={
                product.salePrice !== null &&
                product.salePrice < product.basePrice
              }
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/3 py-12 text-center">
          <p className="text-gray-500 text-sm">
            No products in this collection yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="py-12 md:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Collections
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our curated collections of premium streetwear.
          </p>
        </div>
      </div>

      {/* Browse All Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <Link
          href="/collections/all"
          className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/3 p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/6"
        >
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-1">
              Browse All Products
            </h2>
            <p className="text-gray-400 text-sm">
              View our complete catalog of premium streetwear essentials.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-4" />
        </Link>
      </div>

      {/* Collection Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
        {collections.map((collection) => (
          <CollectionSection key={collection.href} {...collection} />
        ))}
      </div>
    </div>
  );
}
