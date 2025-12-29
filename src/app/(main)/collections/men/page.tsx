import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { ProductCardProps } from "@/components/products/ProductCard";

// Mock data for men's products (will be replaced with tRPC query)
const mensProducts: ProductCardProps[] = [
  {
    id: "m1",
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee",
    price: 45,
    isNew: true,
  },
  { id: "m2", name: "Premium Hoodie", slug: "premium-hoodie", price: 120 },
  {
    id: "m3",
    name: "Relaxed Fit Joggers",
    slug: "relaxed-fit-joggers",
    price: 85,
  },
  { id: "m4", name: "Crew Neck Sweater", slug: "crew-neck-sweater", price: 95 },
  {
    id: "m5",
    name: "Statement Jacket",
    slug: "statement-jacket",
    price: 180,
    isNew: true,
  },
  {
    id: "m6",
    name: "Classic Shorts",
    slug: "classic-shorts",
    price: 55,
    salePrice: 39,
    isOnSale: true,
  },
  { id: "m7", name: "Midnight Bomber", slug: "midnight-bomber", price: 195 },
  {
    id: "m8",
    name: "Urban Tech Joggers",
    slug: "urban-tech-joggers",
    price: 95,
  },
];

export default function CollectionsMenPage() {
  return (
    <CollectionPageLayout
      title="Men's Collection"
      description="Premium streetwear essentials designed for the modern man."
      products={mensProducts}
    />
  );
}
