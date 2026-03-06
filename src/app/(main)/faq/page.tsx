import { FAQHeader } from "@/components/faq/FAQHeader";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { FAQSupport } from "@/components/faq/FAQSupport";

export const metadata = {
  title: "FAQ | Valkyrie",
  description: "Frequently asked questions about Valkyrie.",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <FAQHeader />
      <FAQAccordion />
      <FAQSupport />
    </div>
  );
}
