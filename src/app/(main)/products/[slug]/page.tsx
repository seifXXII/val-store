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
import {
  transformProductForDetail,
  transformRelatedProducts,
} from "@/lib/transformers/products";

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
  const productForDetail = transformProductForDetail(product);

  // Get related products (excluding current)
  const relatedProductsData = await getCachedRelatedProducts(product.id, 4);
  const relatedProducts = transformRelatedProducts(relatedProductsData);

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
