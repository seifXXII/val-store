import { ShippingHeader } from "@/components/shipping/ShippingHeader";
import { ShippingOptions } from "@/components/shipping/ShippingOptions";
import { ShippingPolicy } from "@/components/shipping/ShippingPolicy";

export const metadata = {
  title: "Shipping Information | Valkyrie",
  description:
    "Learn about our shipping options, delivery times, and policies.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <ShippingHeader />
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <ShippingOptions />
      </div>
      <ShippingPolicy />
    </div>
  );
}
