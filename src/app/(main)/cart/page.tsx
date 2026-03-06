"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { CartLoading } from "@/components/cart/CartLoading";
import { CartUnauthenticated } from "@/components/cart/CartUnauthenticated";
import { CartEmpty } from "@/components/cart/CartEmpty";
import { CartPopulated } from "@/components/cart/CartPopulated";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CartPage() {
  const hasMounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const { isLoading, isAuthenticated, isEmpty } = useCart();

  if (!hasMounted || isLoading) return <CartLoading />;
  if (!isAuthenticated) return <CartUnauthenticated />;
  if (isEmpty) return <CartEmpty />;

  return <CartPopulated />;
}
