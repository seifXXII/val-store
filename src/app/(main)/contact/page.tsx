import { ContactHeader } from "@/components/contact/ContactHeader";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactFormPlaceholder } from "@/components/contact/ContactFormPlaceholder";

export const metadata = {
  title: "Contact Us | Valkyrie",
  description: "Get in touch with Valkyrie. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <ContactHeader />
      <div className="grid md:grid-cols-2 gap-8">
        <ContactInfo />
        <ContactFormPlaceholder />
      </div>
    </div>
  );
}
