import { CollectionPageLayout } from "@/components/collections/CollectionPageLayout";
import { ProductCardProps } from "@/components/products/ProductCard";

// Mock data for women's products
const womensProducts: ProductCardProps[] = [
  {
    id: "w1",
    name: "Oversized Crop Tee",
    slug: "oversized-crop-tee",
    price: 48,
    isNew: true,
  },
  {
    id: "w2",
    name: "High-Waist Joggers",
    slug: "high-waist-joggers",
    price: 88,
  },
  { id: "w3", name: "Cropped Hoodie", slug: "cropped-hoodie", price: 110 },
  {
    id: "w4",
    name: "Bodysuit Essential",
    slug: "bodysuit-essential",
    price: 55,
  },
  {
    id: "w5",
    name: "Wide Leg Pants",
    slug: "wide-leg-pants",
    price: 95,
    salePrice: 69,
    isOnSale: true,
  },
  {
    id: "w6",
    name: "Wool Blend Coat",
    slug: "wool-blend-coat",
    price: 220,
    isNew: true,
  },
  { id: "w7", name: "Fitted Ribbed Top", slug: "fitted-ribbed-top", price: 42 },
  { id: "w8", name: "Utility Jacket", slug: "utility-jacket", price: 165 },
];

export default function CollectionsWomenPage() {
  return (
    <CollectionPageLayout
      title="Women's Collection"
      description="Elevated essentials crafted for confidence and comfort."
      products={womensProducts}
    />
  );
}
