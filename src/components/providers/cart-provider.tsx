/**
 * Cart Provider
 *
 * Provider component that syncs cart state with server for authenticated users.
 * Handles initial cart load and provides cart context throughout the app.
 */

"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useCartStore, type CartItem } from "@/lib/stores/cart-store";

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const { setItems, setLoading, setSyncing } = useCartStore();

  // Fetch cart from server for authenticated users
  const { data: serverCart, isLoading } = trpc.public.cart.get.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    }
  );

  // Sync server cart to local store
  useEffect(() => {
    if (isAuthenticated && serverCart) {
      const items: CartItem[] = serverCart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        productImage: item.productImage,
        quantity: item.quantity,
        maxStock: item.maxStock,
      }));
      setItems(items);
    }
  }, [isAuthenticated, serverCart, setItems]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return <>{children}</>;
}

/**
 * Hook for cart operations that syncs with server
 */
export function useCart() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const utils = trpc.useUtils();

  const store = useCartStore();

  // Server mutations
  const addMutation = trpc.public.cart.add.useMutation({
    onSuccess: () => {
      utils.public.cart.get.invalidate();
    },
  });

  const updateMutation = trpc.public.cart.updateQuantity.useMutation({
    onSuccess: () => {
      utils.public.cart.get.invalidate();
    },
  });

  const removeMutation = trpc.public.cart.remove.useMutation({
    onSuccess: () => {
      utils.public.cart.get.invalidate();
    },
  });

  const clearMutation = trpc.public.cart.clear.useMutation({
    onSuccess: () => {
      utils.public.cart.get.invalidate();
    },
  });

  // Add item - sync with server if authenticated
  const addItem = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (isAuthenticated) {
        store.setSyncing(true);
        try {
          await addMutation.mutateAsync({ productId, quantity });
        } finally {
          store.setSyncing(false);
        }
      } else {
        // For guests, we'd need product info - this would require a separate fetch
        // For now, just open cart to prompt login
        store.openCart();
      }
    },
    [isAuthenticated, addMutation, store]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (isAuthenticated) {
        store.setSyncing(true);
        try {
          // Optimistically update local state
          store.updateQuantity(cartItemId, quantity);
          await updateMutation.mutateAsync({ cartItemId, quantity });
        } finally {
          store.setSyncing(false);
        }
      } else {
        store.updateQuantity(cartItemId, quantity);
      }
    },
    [isAuthenticated, updateMutation, store]
  );

  // Remove item
  const removeItem = useCallback(
    async (cartItemId: string) => {
      if (isAuthenticated) {
        store.setSyncing(true);
        try {
          // Optimistically update local state
          store.removeItem(cartItemId);
          await removeMutation.mutateAsync({ cartItemId });
        } finally {
          store.setSyncing(false);
        }
      } else {
        store.removeItem(cartItemId);
      }
    },
    [isAuthenticated, removeMutation, store]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      store.setSyncing(true);
      try {
        store.clearCart();
        await clearMutation.mutateAsync();
      } finally {
        store.setSyncing(false);
      }
    } else {
      store.clearCart();
    }
  }, [isAuthenticated, clearMutation, store]);

  return {
    items: store.items,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    isSyncing: store.isSyncing,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
    isEmpty: store.isEmpty(),
    isAuthenticated,

    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
  };
}
