import { ProductDetail } from "@/components/products/ProductDetail";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { notFound } from "next/navigation";

// Mock product data (will be replaced with tRPC query)
const mockProducts = [
  {
    id: "1",
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee",
    price: 45,
    description:
      "A premium oversized t-shirt crafted from 100% organic cotton. Features a relaxed fit and dropped shoulders for effortless style. Perfect for layering or wearing on its own.",
    details: [
      "100% organic cotton",
      "Relaxed oversized fit",
      "Dropped shoulders",
      "Ribbed crew neckline",
      "Machine washable",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
      { name: "Gray", hex: "#6b7280" },
    ],
    isNew: true,
    inStock: true,
  },
  {
    id: "2",
    name: "Premium Hoodie",
    slug: "premium-hoodie",
    price: 120,
    salePrice: 89,
    description:
      "Our signature hoodie made from heavyweight French terry. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Designed for maximum comfort and durability.",
    details: [
      "400gsm French terry cotton",
      "Kangaroo pocket",
      "Adjustable drawstring hood",
      "Ribbed cuffs and hem",
      "Relaxed fit",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal", hex: "#374151" },
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Olive", hex: "#556b2f" },
    ],
    isOnSale: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Statement Jacket",
    slug: "statement-jacket",
    price: 180,
    description:
      "Make a bold impression with our statement jacket. Crafted from premium materials with attention to every detail. Features a modern cut with functional pockets.",
    details: [
      "Premium polyester blend",
      "Water-resistant finish",
      "Multiple pockets",
      "Metal zipper closure",
      "Lined interior",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Midnight Blue", hex: "#191970" },
    ],
    isNew: true,
    inStock: true,
  },
  {
    id: "4",
    name: "Relaxed Fit Joggers",
    slug: "relaxed-fit-joggers",
    price: 85,
    description:
      "Elevated joggers for everyday wear. Made from soft fleece with a tapered leg and elastic waistband. Comfort meets style.",
    details: [
      "Soft fleece material",
      "Elastic waistband with drawstring",
      "Tapered leg",
      "Side pockets",
      "Ribbed cuffs",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#9ca3af" },
      { name: "Beige", hex: "#d4a574" },
    ],
    inStock: true,
  },
];

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // TODO: Replace with tRPC query
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Get related products (exclude current product)
  const relatedProducts = mockProducts
    .filter((p) => p.slug !== slug)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      isNew: p.isNew,
      isOnSale: p.isOnSale,
    }));

  return (
    <>
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts} />
    </>
  );
}

// Generate static params for common products
export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    slug: product.slug,
  }));
}
