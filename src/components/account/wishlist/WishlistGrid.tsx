import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/db/schema";
import { AppRouter } from "@/server";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type WishlistItem =
  RouterOutputs["public"]["wishlist"]["getMyWishlist"][number];

interface WishlistGridProps {
  items: WishlistItem[];
  onMoveToCart: (product: Pick<Product, "id">) => void;
  onRemove: (productId: string) => void;
}

export function WishlistGrid({
  items,
  onMoveToCart,
  onRemove,
}: WishlistGridProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
        <p className="text-gray-400">
          {items.length} saved item{items.length !== 1 && "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ product }) => {
          if (!product) return null;
          const p = product as unknown as Product & {
            imageUrl: string;
            imageAlt: string;
          };

          return (
            <div
              key={product.id}
              className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-square bg-white/[0.04]">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.imageAlt ?? product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Heart className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:text-val-accent transition-colors"
                >
                  <h3 className="text-sm font-medium text-white line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-white font-semibold mt-1">
                  ${Number(product.salePrice || product.basePrice).toFixed(2)}
                </p>

                <div className="flex gap-2 mt-auto pt-4">
                  <Button
                    className="flex-1 bg-val-accent hover:bg-val-accent/90 text-black font-medium text-sm"
                    size="sm"
                    onClick={() => onMoveToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Move to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemove(product.id)}
                    className="border-white/10 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 h-9 w-9"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
