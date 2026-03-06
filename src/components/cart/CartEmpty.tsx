import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmpty() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <ShoppingBag className="h-20 w-20 text-gray-600 mb-6" />
      <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        Looks like you haven&apos;t added anything to your cart yet. Browse our
        collection to find something you&apos;ll love!
      </p>
      <Button asChild className="bg-val-accent hover:bg-val-accent/90">
        <Link href="/collections/all">
          Start Shopping
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
