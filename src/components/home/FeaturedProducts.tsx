import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ProductCard,
  ProductCardProps,
} from "@/components/products/ProductCard";

// Mock data for featured products (will be replaced with tRPC query)
const mockProducts: ProductCardProps[] = [
  {
    id: "1",
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee",
    price: 45,
    isNew: true,
  },
  {
    id: "2",
    name: "Premium Hoodie",
    slug: "premium-hoodie",
    price: 120,
    salePrice: 89,
    isOnSale: true,
  },
  {
    id: "3",
    name: "Relaxed Fit Joggers",
    slug: "relaxed-fit-joggers",
    price: 85,
  },
  {
    id: "4",
    name: "Minimal Cap",
    slug: "minimal-cap",
    price: 35,
    isNew: true,
  },
  {
    id: "5",
    name: "Crew Neck Sweater",
    slug: "crew-neck-sweater",
    price: 95,
  },
  {
    id: "6",
    name: "Classic Shorts",
    slug: "classic-shorts",
    price: 55,
    salePrice: 39,
    isOnSale: true,
  },
  {
    id: "7",
    name: "Statement Jacket",
    slug: "statement-jacket",
    price: 180,
    isNew: true,
  },
  {
    id: "8",
    name: "Everyday Socks Pack",
    slug: "everyday-socks-pack",
    price: 25,
  },
];

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export function FeaturedProducts({
  title = "Best Sellers",
  subtitle = "Our most popular pieces",
  showViewAll = true,
}: FeaturedProductsProps) {
  // TODO: Replace with tRPC query
  // const { data: products } = trpc.products.getFeatured.useQuery({ limit: 8 });
  const products = mockProducts;

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

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-12">
            <Link href="/collections/all">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white hover:text-black px-8"
              >
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
