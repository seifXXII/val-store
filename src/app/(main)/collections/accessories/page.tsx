import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { ProductCardProps } from "@/components/products/ProductCard";

// Mock data for accessories
const accessoriesProducts: ProductCardProps[] = [
  {
    id: "a1",
    name: "Minimal Cap",
    slug: "minimal-cap",
    price: 35,
    isNew: true,
  },
  { id: "a2", name: "Canvas Tote Bag", slug: "canvas-tote-bag", price: 55 },
  { id: "a3", name: "Wool Blend Beanie", slug: "wool-blend-beanie", price: 38 },
  { id: "a4", name: "Leather Wallet", slug: "leather-wallet", price: 85 },
  {
    id: "a5",
    name: "Statement Belt",
    slug: "statement-belt",
    price: 65,
    salePrice: 45,
    isOnSale: true,
  },
  {
    id: "a6",
    name: "Everyday Socks Pack",
    slug: "everyday-socks-pack",
    price: 25,
  },
  { id: "a7", name: "Structured Cap", slug: "structured-cap", price: 40 },
  {
    id: "a8",
    name: "Crossbody Bag",
    slug: "crossbody-bag",
    price: 95,
    isNew: true,
  },
];

export default function CollectionsAccessoriesPage() {
  return (
    <CollectionPageLayout
      title="Accessories"
      description="Complete your look with our premium accessories collection."
      products={accessoriesProducts}
    />
  );
}
