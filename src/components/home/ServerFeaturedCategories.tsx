/**
 * Server-side Featured Categories
 *
 * Fetches featured categories on the server for instant page load.
 * Uses caching for 60-second revalidation.
 */

import Link from "next/link";
import { container } from "@/application/container";
import { getCachedCategories } from "@/lib/cache";

interface ServerFeaturedCategoriesProps {
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

export async function ServerFeaturedCategories({
  title = "Shop by Category",
  subtitle = "Find your perfect style",
}: ServerFeaturedCategoriesProps) {
  let featuredCategories: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[] = [];

  try {
    // Fetch categories with caching
    const allCategories = await getCachedCategories();

    // Filter to active categories only
    const activeCategories = allCategories.filter((c) => c.isActive);

    // Get first 3 categories with product counts
    const productRepo = container.getProductRepository();
    featuredCategories = await Promise.all(
      activeCategories.slice(0, 3).map(async (category) => {
        const allProducts = await productRepo.findAll();
        const categoryProducts = allProducts.filter(
          (p) => p.isActive && p.categoryId === category.id
        );
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          productCount: categoryProducts.length,
        };
      })
    );
  } catch (error) {
    console.error(
      "[ServerFeaturedCategories] Failed to fetch categories:",
      error
    );
    // featuredCategories stays empty - render empty state
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
          {featuredCategories.map((category) => (
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
