/**
 * Cart Page
 *
 * Full cart page showing all items with checkout functionality.
 */

"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/components/providers/cart-provider";

export default function CartPage() {
  const {
    items,
    isLoading,
    isSyncing,
    itemCount,
    subtotal,
    isEmpty,
    isAuthenticated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="h-20 w-20 text-gray-600 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Sign in to view your cart
        </h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Create an account or sign in to add items to your cart and complete
          your purchase.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" asChild className="border-white/20">
            <Link href="/signup">Create Account</Link>
          </Button>
          <Button asChild className="bg-val-accent hover:bg-val-accent/90">
            <Link href="/login?redirect=/cart">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          Your Cart
        </h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-800/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="h-20 w-20 text-gray-600 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Browse
          our collection to find something you&apos;ll love!
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-400"
          onClick={clearCart}
          disabled={isSyncing}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-white/10 bg-gray-900/30 p-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                disabled={isSyncing}
              />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Button variant="outline" asChild className="border-white/20">
              <Link href="/collections/all">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            itemCount={itemCount}
            isLoading={isSyncing}
          />
        </div>
      </div>
    </div>
  );
}
