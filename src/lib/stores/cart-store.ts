/**
 * Cart Store
 *
 * Zustand store for client-side cart state management.
 * - Guest users: persists to localStorage
 * - Logged-in users: syncs with server via CartProvider
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string | null;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean;
}

interface CartActions {
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  isEmpty: () => boolean;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,
      isLoading: false,
      isSyncing: false,

      // Actions
      setItems: (items: CartItem[]) => set({ items }),

      addItem: (item: CartItem) =>
        set((state: CartState) => {
          const existingIndex = state.items.findIndex(
            (i: CartItem) => i.productId === item.productId
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            const existing = newItems[existingIndex];
            newItems[existingIndex] = {
              ...existing,
              quantity: existing.quantity + item.quantity,
            };
            return { items: newItems };
          }

          return { items: [...state.items, item] };
        }),

      updateQuantity: (cartItemId: string, quantity: number) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        })),

      removeItem: (cartItemId: string) =>
        set((state: CartState) => ({
          items: state.items.filter((item: CartItem) => item.id !== cartItemId),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state: CartState) => ({ isOpen: !state.isOpen })),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setSyncing: (syncing: boolean) => set({ isSyncing: syncing }),

      getItemCount: () => {
        const { items } = get();
        return items.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        );
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (sum: number, item: CartItem) =>
            sum + item.productPrice * item.quantity,
          0
        );
      },

      isEmpty: () => get().items.length === 0,
    }),
    {
      name: "val-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: CartStore) => ({ items: state.items }),
    }
  )
);
