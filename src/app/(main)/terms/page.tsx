import { TermsHeader } from "@/components/terms/TermsHeader";
import { TermsContent } from "@/components/terms/TermsContent";

export const metadata = {
  title: "Terms of Service | Valkyrie",
  description: "Valkyrie terms of service and conditions of use.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <TermsHeader />
      <TermsContent />
    </div>
  );
}
