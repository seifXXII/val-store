import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { ProductCardProps } from "@/components/products/ProductCard";

// Mock data for sale items
const saleProducts: ProductCardProps[] = [
  {
    id: "s1",
    name: "Premium Hoodie",
    slug: "premium-hoodie",
    price: 120,
    salePrice: 89,
    isOnSale: true,
  },
  {
    id: "s2",
    name: "Classic Shorts",
    slug: "classic-shorts",
    price: 55,
    salePrice: 39,
    isOnSale: true,
  },
  {
    id: "s3",
    name: "Wide Leg Pants",
    slug: "wide-leg-pants",
    price: 95,
    salePrice: 69,
    isOnSale: true,
  },
  {
    id: "s4",
    name: "Statement Belt",
    slug: "statement-belt",
    price: 65,
    salePrice: 45,
    isOnSale: true,
  },
  {
    id: "s5",
    name: "Cropped Hoodie",
    slug: "cropped-hoodie",
    price: 110,
    salePrice: 79,
    isOnSale: true,
  },
  {
    id: "s6",
    name: "Canvas Sneakers",
    slug: "canvas-sneakers",
    price: 95,
    salePrice: 59,
    isOnSale: true,
  },
];

export default function CollectionsSalePage() {
  return (
    <CollectionPageLayout
      title="Sale"
      description="Limited time offers on selected items. Don't miss out!"
      products={saleProducts}
    />
  );
}
