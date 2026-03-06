import { ReturnsHeader } from "@/components/returns/ReturnsHeader";
import { ReturnsOptions } from "@/components/returns/ReturnsOptions";
import { ReturnsContent } from "@/components/returns/ReturnsContent";

export const metadata = {
  title: "Returns & Exchanges | Valkyrie",
  description: "Learn about our hassle-free return and exchange policy.",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <ReturnsHeader />
      <ReturnsOptions />
      <ReturnsContent />
    </div>
  );
}
