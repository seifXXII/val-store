import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartUnauthenticated() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <ShoppingBag className="h-20 w-20 text-gray-600 mb-6" />
      <h1 className="text-2xl font-bold text-white mb-2">
        Sign in to view your cart
      </h1>
      <p className="text-gray-400 mb-8 max-w-md">
        Create an account or sign in to add items to your cart and complete your
        purchase.
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          asChild
          className="border-white/10 text-gray-300 hover:bg-white/[0.04] hover:text-white"
        >
          <Link href="/signup">Create Account</Link>
        </Button>
        <Button asChild className="bg-val-accent hover:bg-val-accent/90">
          <Link href="/login?redirect=/cart">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
