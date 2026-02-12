/**
 * Admin Product Edit Page
 *
 * Server component that wraps the client-side edit form.
 */

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ProductEditForm } from "@/components/admin/products/ProductEditForm";
import { container } from "@/application/container";

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { id } = await params;

  // Fetch product slug for the "View on Store" link
  const useCase = container.getGetProductUseCase();
  const product = await useCase.execute({ id }).catch(() => null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        {product && (
          <Button variant="outline" size="sm" asChild className="ml-auto">
            <Link href={`/products/${product.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Store
            </Link>
          </Button>
        )}
      </div>

      <ProductEditForm productId={id} />
    </div>
  );
}
