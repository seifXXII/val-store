import { AboutHero } from "@/components/about/AboutHero";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata = {
  title: "About Us | Valkyrie",
  description:
    "Learn about Valkyrie and our mission to bring premium streetwear to everyone.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AboutHero />
      <AboutValues />
      <AboutContent />
    </div>
  );
}
