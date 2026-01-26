"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProductCard,
  ProductCardProps,
} from "@/components/products/ProductCard";

// Mock data for new arrivals (will be replaced with tRPC query)
const mockNewArrivals: ProductCardProps[] = [
  {
    id: "na1",
    name: "Midnight Bomber Jacket",
    slug: "midnight-bomber-jacket",
    price: 195,
    isNew: true,
  },
  {
    id: "na2",
    name: "Urban Tech Joggers",
    slug: "urban-tech-joggers",
    price: 95,
    isNew: true,
  },
  {
    id: "na3",
    name: "Minimal Logo Tee",
    slug: "minimal-logo-tee",
    price: 45,
    isNew: true,
  },
  {
    id: "na4",
    name: "Wool Blend Beanie",
    slug: "wool-blend-beanie",
    price: 35,
    isNew: true,
  },
  {
    id: "na5",
    name: "Structured Cap",
    slug: "structured-cap",
    price: 40,
    isNew: true,
  },
  {
    id: "na6",
    name: "Premium Zip Hoodie",
    slug: "premium-zip-hoodie",
    price: 140,
    isNew: true,
  },
  {
    id: "na7",
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    price: 55,
    isNew: true,
  },
  {
    id: "na8",
    name: "Relaxed Fit Jeans",
    slug: "relaxed-fit-jeans",
    price: 110,
    isNew: true,
  },
];

interface NewArrivalsProps {
  title?: string;
  subtitle?: string;
}

export function NewArrivals({
  title = "New Arrivals",
  subtitle = "Fresh drops just for you",
}: NewArrivalsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // TODO: Replace with tRPC query
  // const { data: products } = trpc.products.getNewArrivals.useQuery({ limit: 8, daysAgo: 30 });
  const products = mockNewArrivals;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h2>
            <p className="text-gray-400">{subtitle}</p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 md:w-72 snap-start"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/collections/new">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-val-silver px-8 py-6 text-base font-medium tracking-wide"
            >
              View All New Arrivals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
