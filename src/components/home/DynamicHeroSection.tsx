"use client";

/**
 * Dynamic Hero Section
 *
 * Fetches hero config from public API and renders dynamically.
 */

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export function DynamicHeroSection() {
  // Fetch hero section config from public API
  const { data: heroConfig, isLoading } =
    trpc.public.config.getSection.useQuery(
      { sectionType: "hero" },
      { staleTime: 1000 * 60 * 5 } // Cache for 5 minutes
    );

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  // Default values
  const title = heroConfig?.content?.title || "Elevate Your Style";
  const subtitle =
    heroConfig?.content?.subtitle ||
    "Discover the new collection crafted for those who dare to stand out.";
  const ctaText = heroConfig?.content?.ctaText || "Shop Now";
  const ctaLink = heroConfig?.content?.ctaLink || "/collections/all";
  const backgroundImage = heroConfig?.content?.backgroundImage;
  const overlayOpacity = heroConfig?.content?.overlayOpacity || 40;
  const textAlignment = (heroConfig?.content?.textAlignment || "center") as
    | "left"
    | "center"
    | "right";

  // Text alignment classes
  const alignmentClasses: Record<"left" | "center" | "right", string> = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  if (isLoading) {
    return (
      <section className="relative h-[calc(100vh-96px)] md:h-[calc(100vh-104px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-val-steel via-gray-900 to-black">
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
          <Skeleton className="h-12 w-32 mx-auto" />
        </div>
      </section>
    );
  }

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

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </button>
    </section>
  );
}
