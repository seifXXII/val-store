"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cart-store";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutAddressSelection } from "@/components/checkout/CheckoutAddressSelection";
import {
  CheckoutPaymentMethod,
  PaymentMethod,
} from "@/components/checkout/CheckoutPaymentMethod";

import { AppRouter } from "@/server";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type AddressList = RouterOutputs["public"]["address"]["list"];

export function CheckoutForm({ addresses }: { addresses: AddressList }) {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash_on_delivery");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    couponId: string;
    discountAmount: number;
    discountType: string;
    discountValue: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = useCartStore((state) => state.getSubtotal());

  const validateCoupon = trpc.public.coupons.validate.useMutation({
    onSuccess: (result) => {
      if (result.valid && "code" in result) {
        setAppliedCoupon({
          code: result.code,
          couponId: result.couponId,
          discountAmount: result.discountAmount ?? 0,
          discountType: result.discountType,
          discountValue: result.discountValue,
        });
        setCouponCode("");
        setCouponError(null);
      } else if (!result.valid && "error" in result) {
        setCouponError(result.error ?? "Invalid coupon");
      }
    },
    onError: (err) => {
      setCouponError(err.message);
    },
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    validateCoupon.mutate({ code: couponCode, subtotal });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const defaultAddressId = useMemo(() => {
    const def = addresses.find((a) => a.isDefault);
    return def?.id ?? addresses[0]?.id ?? "";
  }, [addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const effectiveSelectedAddressId = selectedAddressId ?? defaultAddressId;

  // Checkout mutations
  const createStripeSession = trpc.public.checkout.createSession.useMutation({
    onError: (err) => {
      toast.error("Failed to start Stripe checkout", {
        description: err.message,
      });
    },
  });

  const createCodOrder = trpc.public.checkout.createCodOrder.useMutation({
    onError: (err) => {
      toast.error("Failed to place order", { description: err.message });
    },
  });

  const isPlacingOrder =
    createStripeSession.isPending || createCodOrder.isPending;

  const placeOrder = async () => {
    if (!effectiveSelectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    if (paymentMethod === "stripe") {
      const res = await createStripeSession.mutateAsync({
        shippingAddressId: effectiveSelectedAddressId,
      });
      if (res?.url) {
        window.location.href = res.url;
      }
      return;
    }

    const res = await createCodOrder.mutateAsync({
      shippingAddressId: effectiveSelectedAddressId,
    });
    router.push(`/checkout/success?order_id=${res.orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Review your order and select delivery options.
          </p>
        </div>

        <CheckoutOrderSummary
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          isValidating={validateCoupon.isPending}
          couponError={couponError}
        />

        <CheckoutAddressSelection
          addresses={addresses}
          selectedAddressId={effectiveSelectedAddressId}
          onAddressChange={setSelectedAddressId}
        />

        <CheckoutPaymentMethod
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />

        <div className="flex gap-3">
          <Button onClick={placeOrder} disabled={isPlacingOrder}>
            Place Order
          </Button>
          <Button variant="outline" onClick={() => router.push("/cart")}>
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
