import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  preHeadline?: string;
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function PromoBanner({
  preHeadline = "Limited Time",
  headline = "Winter Sale",
  description = "Up to 40% off on selected items. Don't miss out on our biggest sale of the season.",
  ctaText = "Shop Sale",
  ctaLink = "/collections/sale",
}: PromoBannerProps) {
  return (
    <section className="bg-val-steel">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">
        {/* Image Side */}
        <div className="relative aspect-square md:aspect-auto md:min-h-[400px]">
          {/* Placeholder gradient (replace with actual image) */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
              }}
            />
          </div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <span className="text-val-accent text-sm uppercase tracking-wider font-medium">
            {preHeadline}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2">
            {headline}
          </h2>
          <p className="text-gray-400 mt-4 max-w-md">{description}</p>
          <Link href={ctaLink} className="mt-6 w-fit">
            <Button className="bg-white text-black hover:bg-val-silver px-6 py-3">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
