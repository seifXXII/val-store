import { ProductsListHeader } from "@/components/admin/products-list/ProductsListHeader";
import { ProductsTable } from "@/components/admin/products-list/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductsListHeader />
      <ProductsTable />
    </div>
  );
}
