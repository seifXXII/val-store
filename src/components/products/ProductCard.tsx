import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  primaryImage?: string;
  secondaryImage?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
}

export function ProductCard({
  name,
  slug,
  price,
  salePrice,
  isNew = false,
  isOnSale = false,
}: ProductCardProps) {
  const formattedPrice = price.toFixed(2);
  const formattedSalePrice = salePrice?.toFixed(2);

  return (
    <div className="group relative">
      {/* Image Container */}
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-val-steel">
          {/* Primary Image (placeholder gradient) */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 transition-opacity duration-300 group-hover:opacity-0" />

          {/* Secondary Image (placeholder gradient - slightly different) */}
          <div className="absolute inset-0 bg-gradient-to-tl from-gray-600 via-gray-700 to-gray-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isNew && (
              <Badge className="bg-val-accent text-white text-xs px-2 py-0.5">
                New
              </Badge>
            )}
            {isOnSale && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5">
                Sale
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-val-accent z-10"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
            <Button className="w-full bg-white text-black hover:bg-val-silver text-sm py-2">
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3">
        <Link href={`/products/${slug}`}>
          <h3 className="text-sm font-medium text-white truncate hover:text-val-accent transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {salePrice ? (
            <>
              <span className="text-red-400 font-medium">
                ${formattedSalePrice}
              </span>
              <span className="text-gray-500 line-through text-sm">
                ${formattedPrice}
              </span>
            </>
          ) : (
            <span className="text-gray-300">${formattedPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
