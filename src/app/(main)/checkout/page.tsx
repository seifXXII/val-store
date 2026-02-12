"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cart-store";
import { ShoppingBag } from "lucide-react";

type PaymentMethod = "stripe" | "cash_on_delivery";

function OrderSummaryCard({
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isValidating,
  couponError,
}: {
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: {
    code: string;
    discountAmount: number;
    discountType: string;
    discountValue: string;
  } | null;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  isValidating: boolean;
  couponError: string | null;
}) {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const itemCount = useCartStore((state) => state.getItemCount());
  const discount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/collections/all">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="font-medium text-sm line-clamp-1">
                {item.productName}
              </p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity} × ${item.productPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center font-medium">
              ${(item.quantity * item.productPrice).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Coupon Input */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium">Coupon Code</Label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between mt-2 p-2 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-green-700 dark:text-green-400">
                  {appliedCoupon.code}
                </span>
                <span className="text-sm text-green-600 dark:text-green-500">
                  (
                  {appliedCoupon.discountType === "percentage"
                    ? `${appliedCoupon.discountValue}% off`
                    : `-$${appliedCoupon.discountValue}`}
                  )
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveCoupon}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border rounded-md text-sm uppercase"
              />
              <Button
                variant="outline"
                onClick={onApplyCoupon}
                disabled={!couponCode.trim() || isValidating}
              >
                {isValidating ? "..." : "Apply"}
              </Button>
            </div>
          )}
          {couponError && (
            <p className="text-sm text-red-500 mt-1">{couponError}</p>
          )}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
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

  const { data: addresses = [], isLoading: isLoadingAddresses } =
    trpc.public.address.list.useQuery();

  const defaultAddressId = useMemo(() => {
    const def = addresses.find((a) => a.isDefault);
    return def?.id ?? addresses[0]?.id ?? "";
  }, [addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const effectiveSelectedAddressId = selectedAddressId ?? defaultAddressId;

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

  if (isLoadingAddresses) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="h-10 w-48 rounded bg-muted animate-pulse mb-6" />
        <div className="h-48 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              You need at least one address before you can place an order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/account/addresses">Add an address</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Review your order and select delivery options.
          </p>
        </div>

        {/* Order Summary */}
        <OrderSummaryCard
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          isValidating={validateCoupon.isPending}
          couponError={couponError}
        />

        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
            <CardDescription>Default address is preselected.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={effectiveSelectedAddressId}
              onValueChange={setSelectedAddressId}
              className="space-y-3"
            >
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 rounded-md border p-3"
                >
                  <RadioGroupItem
                    value={a.id}
                    id={`addr-${a.id}`}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={`addr-${a.id}`} className="font-medium">
                      {a.name} {a.isDefault ? "(Default)" : ""}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      <div>{a.street}</div>
                      <div>
                        {a.city}
                        {a.state ? `, ${a.state}` : ""}
                        {a.zipCode ? ` ${a.zipCode}` : ""}
                      </div>
                      {a.country ? <div>{a.country}</div> : null}
                      <div>{a.phone}</div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/account/addresses">Manage addresses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Shipping is paid on delivery. Online payments are via Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              className="space-y-3"
            >
              <div className="flex items-start gap-3 rounded-md border p-3">
                <RadioGroupItem
                  value="cash_on_delivery"
                  id="pm-cod"
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="pm-cod" className="font-medium">
                    Cash on Delivery
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Pay the delivery person when your order arrives.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border p-3">
                <RadioGroupItem
                  value="stripe"
                  id="pm-stripe"
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="pm-stripe" className="font-medium">
                    Card (Stripe)
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    You will be redirected to Stripe to complete payment.
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

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
