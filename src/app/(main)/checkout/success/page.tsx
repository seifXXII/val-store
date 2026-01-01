"use client";

/**
 * Checkout Success Page
 *
 * Displayed after successful Stripe checkout.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear local cart on success
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>

        <p className="text-muted-foreground mb-6">
          Your payment was successful and your order is being processed.
          You&apos;ll receive a confirmation email shortly.
        </p>

        {sessionId && (
          <p className="text-sm text-muted-foreground mb-6">
            Order reference: {sessionId.slice(-12).toUpperCase()}
          </p>
        )}

        <div className="bg-muted rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="h-5 w-5" />
            <span className="font-medium">What happens next?</span>
          </div>
          <ul className="text-sm text-muted-foreground text-left space-y-2">
            <li>• You&apos;ll receive an order confirmation email</li>
            <li>• We&apos;ll prepare your items for shipping</li>
            <li>• You&apos;ll get tracking info when shipped</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
