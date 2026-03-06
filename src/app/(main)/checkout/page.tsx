"use client";

import { trpc } from "@/lib/trpc";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutNoAddress } from "@/components/checkout/CheckoutNoAddress";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const { data: addresses = [], isLoading: isLoadingAddresses } =
    trpc.public.address.list.useQuery();

  if (isLoadingAddresses) return <CheckoutLoading />;
  if (addresses.length === 0) return <CheckoutNoAddress />;

  return <CheckoutForm addresses={addresses} />;
}
