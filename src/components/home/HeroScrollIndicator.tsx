"use client";

/**
 * Hero Scroll Indicator
 *
 * Client component for the scroll button interactivity.
 */

import { ChevronDown } from "lucide-react";

export function HeroScrollIndicator() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
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
  );
}
