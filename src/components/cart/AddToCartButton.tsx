/**
 * Add to Cart Button
 *
 * Button component for adding products to cart.
 * Handles loading state and shows feedback on success.
 */

"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { toast } from "sonner";
import Link from "next/link";

interface AddToCartButtonProps {
  productId: string;
  productName?: string;
  quantity?: number;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
  showText = true,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, openCart, isAuthenticated } = useCart();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Show login prompt
      toast.info("Please sign in to add items to your cart", {
        action: {
          label: "Sign In",
          onClick: () => {
            window.location.href = "/login";
          },
        },
      });
      return;
    }

    setIsAdding(true);
    try {
      await addItem(productId, quantity);
      setJustAdded(true);
      toast.success(
        productName ? `${productName} added to cart` : "Added to cart"
      );
      openCart();

      // Reset "just added" state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`bg-val-accent hover:bg-val-accent/90 text-white ${className}`}
        asChild
      >
        <Link
          href={`/login?redirect=${encodeURIComponent(window?.location?.pathname || "/")}`}
        >
          <LogIn className="h-4 w-4" />
          {showText && <span className="ml-2">Sign In to Buy</span>}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`bg-val-accent hover:bg-val-accent/90 text-white ${className}`}
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
    >
      {isAdding ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && <span className="ml-2">Adding...</span>}
        </>
      ) : justAdded ? (
        <>
          <Check className="h-4 w-4" />
          {showText && <span className="ml-2">Added!</span>}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {showText && <span className="ml-2">Add to Cart</span>}
        </>
      )}
    </Button>
  );
}
