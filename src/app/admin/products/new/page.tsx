import { CreateProductHeader } from "@/components/admin/create-product/CreateProductHeader";
import { BasicInfoSection } from "@/components/admin/create-product/BasicInfoSection";
import { PricingSection } from "@/components/admin/create-product/PricingSection";
import { VariantsSection } from "@/components/admin/create-product/VariantsSection";
import { AdditionalDetailsSection } from "@/components/admin/create-product/AdditionalDetailsSection";
import { ProductSidebar } from "@/components/admin/create-product/ProductSidebar";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <CreateProductHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection />
          <PricingSection />
          <VariantsSection />
          <AdditionalDetailsSection />
        </div>

        {/* Sidebar */}
        <ProductSidebar />
      </div>
    </div>
  );
}
