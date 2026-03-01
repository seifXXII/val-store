"use client";

/**
 * Collections Landing Page
 *
 * Displays all collections as sections with product previews.
 * Each collection shows a header and a row of products from that category.
 */

import { CollectionsHeader } from "@/components/collections/CollectionsHeader";
import { BrowseAllBanner } from "@/components/collections/BrowseAllBanner";
import { CollectionSection } from "@/components/collections/CollectionSection";

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

export default function CollectionsPage() {
  return (
    <div className="min-h-screen">
      <CollectionsHeader />
      <BrowseAllBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
        {collections.map((collection) => (
          <CollectionSection key={collection.href} {...collection} />
        ))}
      </div>
    </div>
  );
}
