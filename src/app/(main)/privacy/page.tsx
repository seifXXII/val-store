import { PrivacyHeader } from "@/components/privacy/PrivacyHeader";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";

export const metadata = {
  title: "Privacy Policy | Valkyrie",
  description: "Valkyrie privacy policy and data protection information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PrivacyHeader />
      <PrivacyContent />
    </div>
  );
}
