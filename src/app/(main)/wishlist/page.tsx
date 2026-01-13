"use client";

/**
 * Wishlist Page
 *
 * Displays user's saved items.
 */

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      toast("Removed from wishlist");
    },
    onError: (err) => {
      toast.error("Failed to remove from wishlist", {
        description: err.message,
      });
    },
  });

  const handleMoveToCart = async (product: Pick<Product, "id">) => {
    // 1. Add to cart
    addItem(product.id, 1);

    // 2. Remove from wishlist
    removeMutation.mutate({ productId: product.id });
  };

  const handleRemove = (productId: string) => {
    removeMutation.mutate({ productId });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Your wishlist is empty.
            </p>
            <Link href="/" className="text-primary hover:underline">
              Browse products
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map(({ product }) => {
          const p = product as unknown as Product & {
            imageUrl: string;
            imageAlt: string;
          };
          if (!product) return null;

          return (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-square">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.imageAlt ?? product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:underline"
                >
                  <CardTitle className="text-lg line-clamp-1">
                    {product.name}
                  </CardTitle>
                </Link>
                <p className="font-semibold mt-1">
                  ${Number(product.salePrice || product.basePrice).toFixed(2)}
                </p>
              </CardHeader>
              <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleMoveToCart(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Move to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemove(product.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
