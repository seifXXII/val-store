import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BrowseAllBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
      <Link
        href="/collections/all"
        className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/3 p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/6"
      >
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-white mb-1">
            Browse All Products
          </h2>
          <p className="text-gray-400 text-sm">
            View our complete catalog of premium streetwear essentials.
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-4" />
      </Link>
    </div>
  );
}
