"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  preHeadline?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

export function HeroSection({
  preHeadline = "New Season",
  headline = "Elevate Your Style",
  subheadline = "Discover the new collection crafted for those who dare to stand out.",
  ctaText = "Shop Now",
  ctaLink = "/collections/all",
}: HeroSectionProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-[calc(100vh-96px)] md:h-[calc(100vh-104px)] flex items-center justify-center overflow-hidden">
      {/* Background - gradient placeholder (can be replaced with image/video) */}
      <div className="absolute inset-0 bg-gradient-to-br from-val-steel via-gray-900 to-black" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Pre-headline */}
        {preHeadline && (
          <p className="text-val-accent text-sm sm:text-base uppercase tracking-widest mb-4 animate-fade-in">
            {preHeadline}
          </p>
        )}

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-8">
          {subheadline}
        </p>

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
