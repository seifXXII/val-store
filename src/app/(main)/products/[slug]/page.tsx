/**
 * Product Detail Page (Server Component)
 *
 * Fetches product data from the database using cached queries.
 * Displays product details, images, variants, and related products.
 */

import { ProductDetail } from "@/components/products/ProductDetail";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { ProductReviews } from "@/components/products/ProductReviews";
import { notFound } from "next/navigation";
import { getCachedProductBySlug, getCachedRelatedProducts } from "@/lib/cache";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product from database (cached)
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Transform to format expected by ProductDetail component
  const productForDetail = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.basePrice,
    salePrice: product.salePrice ?? undefined,
    description: product.description ?? "",
    details: product.careInstructions
      ? product.careInstructions.split("\n").filter(Boolean)
      : product.material
        ? [`Material: ${product.material}`]
        : [],
    sizes: [
      ...new Set(product.variants.map((v) => v.size).filter(Boolean)),
    ] as string[],
    colors: product.variants
      .filter((v) => v.color)
      .reduce(
        (acc, v) => {
          if (!acc.find((c) => c.name === v.color)) {
            acc.push({ name: v.color!, hex: "#000000" }); // Default hex, could be enhanced
          }
          return acc;
        },
        [] as { name: string; hex: string }[]
      ),
    images: product.images.map((img) => img.imageUrl),
    isOnSale:
      product.salePrice !== null && product.salePrice < product.basePrice,
    inStock: product.variants.some((v) => v.inStock),
  };

  // Get related products (excluding current)
  const relatedProductsData = await getCachedRelatedProducts(product.id, 4);
  const relatedProducts = relatedProductsData.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.basePrice,
    salePrice: p.salePrice ?? undefined,
    primaryImage: p.primaryImage ?? undefined,
    isOnSale: p.salePrice !== null && p.salePrice < p.basePrice,
  }));

  return (
    <>
      <ProductDetail product={productForDetail} />
      <div className="container py-8">
        <ProductReviews productId={product.id} />
      </div>
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </>
  );
}

// Generate static params is removed since we're fetching dynamically from DB
