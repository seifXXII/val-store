/**
 * Admin Product Edit Page
 *
 * Server component that wraps the client-side edit form.
 */

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductEditForm } from "@/components/admin/products/ProductEditForm";

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <ProductEditForm productId={id} />
    </div>
  );
}
