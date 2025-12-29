/**
 * Server-side Hero Section
 *
 * Fetches hero config on the server for instant page load.
 * Uses caching for 60-second revalidation.
 */

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCachedHeroSection } from "@/lib/cache";
import { HeroScrollIndicator } from "./HeroScrollIndicator";

interface HeroContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  textAlignment?: "left" | "center" | "right";
}

// Complete default values - always shows content
const DEFAULT_HERO: HeroContent = {
  title: "Elevate Your Style",
  subtitle:
    "Discover the new collection crafted for those who dare to stand out.",
  ctaText: "Shop Now",
  ctaLink: "/collections/all",
  backgroundImage: undefined,
  overlayOpacity: 40,
  textAlignment: "center",
};

export async function ServerHeroSection() {
  // Start with defaults
  let content: HeroContent = DEFAULT_HERO;

  // Try to fetch from CMS (with caching), fall back to defaults on any error
  try {
    const heroSection = await getCachedHeroSection();

    if (heroSection?.isActive) {
      const parsed = heroSection.getContentParsed<HeroContent>();
      content = { ...DEFAULT_HERO, ...parsed };
    }
  } catch (error) {
    console.error("[ServerHeroSection] Failed to fetch hero config:", error);
    // Falls back to DEFAULT_HERO automatically
  }

  // Use content with safe defaults for all optional fields
  const title = content.title ?? "Elevate Your Style";
  const subtitle =
    content.subtitle ??
    "Discover the new collection crafted for those who dare to stand out.";
  const ctaText = content.ctaText ?? "Shop Now";
  const ctaLink = content.ctaLink ?? "/collections/all";
  const backgroundImage = content.backgroundImage;
  const overlayOpacity = content.overlayOpacity ?? 40;
  const textAlignment = content.textAlignment ?? "center";

  // Text alignment classes
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <section className="relative h-[calc(100vh-96px)] md:h-[calc(100vh-104px)] flex items-center justify-center overflow-hidden">
      {/* Background Image or Gradient */}
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          priority
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-val-steel via-gray-900 to-black" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col px-4 sm:px-6 max-w-4xl mx-auto w-full ${alignmentClasses[textAlignment]}`}
      >
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
          {title}
        </h1>

        {/* Subheadline */}
        {subtitle && (
          <p
            className={`text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mb-8 ${textAlignment === "center" ? "mx-auto" : ""}`}
          >
            {subtitle}
          </p>
        )}

        {/* CTA Button */}
        <Link href={ctaLink}>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-val-silver px-8 py-6 text-base font-medium tracking-wide"
          >
            {ctaText}
          </Button>
        </Link>
      </div>

      {/* Scroll Indicator - Client Component for interactivity */}
      <HeroScrollIndicator />
    </section>
  );
}
