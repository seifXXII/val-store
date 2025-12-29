import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { ProductCardProps } from "@/components/products/ProductCard";

// Mock data for new arrivals
const newArrivalsProducts: ProductCardProps[] = [
  {
    id: "n1",
    name: "Midnight Bomber Jacket",
    slug: "midnight-bomber-jacket",
    price: 195,
    isNew: true,
  },
  {
    id: "n2",
    name: "Urban Tech Joggers",
    slug: "urban-tech-joggers",
    price: 95,
    isNew: true,
  },
  {
    id: "n3",
    name: "Minimal Logo Tee",
    slug: "minimal-logo-tee",
    price: 45,
    isNew: true,
  },
  {
    id: "n4",
    name: "Wool Blend Beanie",
    slug: "wool-blend-beanie",
    price: 35,
    isNew: true,
  },
  {
    id: "n5",
    name: "Structured Cap",
    slug: "structured-cap",
    price: 40,
    isNew: true,
  },
  {
    id: "n6",
    name: "Premium Zip Hoodie",
    slug: "premium-zip-hoodie",
    price: 140,
    isNew: true,
  },
  {
    id: "n7",
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    price: 55,
    isNew: true,
  },
  {
    id: "n8",
    name: "Relaxed Fit Jeans",
    slug: "relaxed-fit-jeans",
    price: 110,
    isNew: true,
  },
];

export default function CollectionsNewPage() {
  return (
    <CollectionPageLayout
      title="New Arrivals"
      description="The latest drops from our collection. Fresh styles just for you."
      products={newArrivalsProducts}
    />
  );
}
