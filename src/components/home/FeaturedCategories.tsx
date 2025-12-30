import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
}

const categories: CategoryCardProps[] = [
  {
    name: "Men's",
    slug: "/collections/men",
    image: "/images/categories/mens.jpg",
    itemCount: 120,
  },
  {
    name: "Women's",
    slug: "/collections/women",
    image: "/images/categories/womens.jpg",
    itemCount: 150,
  },
  {
    name: "Accessories",
    slug: "/collections/accessories",
    image: "/images/categories/accessories.jpg",
    itemCount: 85,
  },
];

function CategoryCard({
  name,
  slug,
  itemCount,
}: Omit<CategoryCardProps, "image">) {
  return (
    <Link href={slug} className="group relative block overflow-hidden">
      {/* Image container with aspect ratio */}
      <div className="relative aspect-[3/4] bg-val-steel overflow-hidden">
        {/* Placeholder gradient background (replace with actual image) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 transition-transform duration-500 group-hover:scale-105" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/50" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {name}
          </h3>
          {itemCount && (
            <p className="text-sm text-gray-300">{itemCount} items</p>
          )}
        </div>
      </div>
    </Link>
  );
}

interface FeaturedCategoriesProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedCategories({
  title = "Shop by Category",
  subtitle = "Find your perfect style",
}: FeaturedCategoriesProps) {
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
          {categories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
