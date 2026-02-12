"use client";

/**
 * Wishlist Page (Account)
 *
 * Displays user's saved items within the account layout.
 */

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { type Product } from "@/db/schema";
import { toast } from "sonner";

export default function WishlistPage() {
  const { addItem } = useCart();
  const utils = trpc.useUtils();

  const { data: wishlistItems, isLoading } =
    trpc.public.wishlist.getMyWishlist.useQuery();

  const removeMutation = trpc.public.wishlist.removeFromWishlist.useMutation({
    onSuccess: () => {
      utils.public.wishlist.getMyWishlist.invalidate();
      utils.public.wishlist.getCount.invalidate();
      toast("Removed from wishlist");
    },
    onError: (err) => {
      toast.error("Failed to remove from wishlist", {
        description: err.message,
      });
    },
  });

  const handleMoveToCart = async (product: Pick<Product, "id">) => {
    addItem(product.id, 1);
    removeMutation.mutate({ productId: product.id });
  };

  const handleRemove = (productId: string) => {
    removeMutation.mutate({ productId });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
          <p className="text-gray-400">Your saved items</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-white/[0.06] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
          <p className="text-gray-400">Your saved items</p>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-lg py-16 text-center">
          <Heart className="h-12 w-12 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
          <Link
            href="/collections/all"
            className="text-val-accent hover:underline"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
        <p className="text-gray-400">
          {wishlistItems.length} saved item{wishlistItems.length !== 1 && "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistItems.map(({ product }) => {
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
              {/* Product Image */}
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

              {/* Product Info */}
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

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4">
                  <Button
                    className="flex-1 bg-val-accent hover:bg-val-accent/90 text-black font-medium text-sm"
                    size="sm"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Move to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(product.id)}
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
