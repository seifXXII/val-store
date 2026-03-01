import Link from "next/link";
import { Heart } from "lucide-react";

export function WishlistEmpty() {
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
