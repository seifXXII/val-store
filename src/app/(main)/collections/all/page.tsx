import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { ProductCardProps } from "@/components/products/ProductCard";

// Mock data for all products
const allProducts: ProductCardProps[] = [
  {
    id: "p1",
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee",
    price: 45,
    isNew: true,
  },
  {
    id: "p2",
    name: "Premium Hoodie",
    slug: "premium-hoodie",
    price: 120,
    salePrice: 89,
    isOnSale: true,
  },
  {
    id: "p3",
    name: "Relaxed Fit Joggers",
    slug: "relaxed-fit-joggers",
    price: 85,
  },
  {
    id: "p4",
    name: "Minimal Cap",
    slug: "minimal-cap",
    price: 35,
    isNew: true,
  },
  { id: "p5", name: "Crew Neck Sweater", slug: "crew-neck-sweater", price: 95 },
  {
    id: "p6",
    name: "Classic Shorts",
    slug: "classic-shorts",
    price: 55,
    salePrice: 39,
    isOnSale: true,
  },
  {
    id: "p7",
    name: "Statement Jacket",
    slug: "statement-jacket",
    price: 180,
    isNew: true,
  },
  {
    id: "p8",
    name: "Everyday Socks Pack",
    slug: "everyday-socks-pack",
    price: 25,
  },
  {
    id: "p9",
    name: "Oversized Crop Tee",
    slug: "oversized-crop-tee",
    price: 48,
    isNew: true,
  },
  {
    id: "p10",
    name: "High-Waist Joggers",
    slug: "high-waist-joggers",
    price: 88,
  },
  { id: "p11", name: "Canvas Tote Bag", slug: "canvas-tote-bag", price: 55 },
  {
    id: "p12",
    name: "Wool Blend Beanie",
    slug: "wool-blend-beanie",
    price: 38,
  },
];

export default function CollectionsAllPage() {
  return (
    <CollectionPageLayout
      title="All Products"
      description="Browse our complete collection of premium streetwear essentials."
      products={allProducts}
    />
  );
}
