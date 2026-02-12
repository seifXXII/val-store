"use client";

/**
 * Order Detail Page
 *
 * Display full order details.
 */

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  processing: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  shipped: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  delivered: "bg-green-500/15 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading } = trpc.public.orders.getOrderById.useQuery({
    orderId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-white/[0.06] rounded w-48 animate-pulse" />
        <div className="h-64 bg-white/[0.06] rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-lg py-12 text-center">
        <p className="text-gray-400 mb-4">Order not found.</p>
        <Button
          asChild
          className="bg-val-accent hover:bg-val-accent/90 text-black font-medium"
        >
          <Link href="/account/orders">View All Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="text-gray-400 hover:text-white hover:bg-white/[0.04]"
        >
          <Link href="/account/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Order #{orderId.slice(-8)}
          </h2>
          <p className="text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
            statusColors[order.status] || "bg-white/10 text-gray-400"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Order Timeline */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Order Status</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4">
            <TimelineStep
              icon={Package}
              label="Order Placed"
              date={new Date(order.createdAt)}
              completed={true}
            />
            <div className="flex-1 h-1 bg-white/10 rounded overflow-hidden">
              <div
                className={`h-full bg-val-accent rounded transition-all ${
                  order.shippedAt ? "w-full" : "w-0"
                }`}
              />
            </div>
            <TimelineStep
              icon={Truck}
              label="Shipped"
              date={order.shippedAt ? new Date(order.shippedAt) : null}
              completed={!!order.shippedAt}
            />
            <div className="flex-1 h-1 bg-white/10 rounded overflow-hidden">
              <div
                className={`h-full bg-val-accent rounded transition-all ${
                  order.deliveredAt ? "w-full" : "w-0"
                }`}
              />
            </div>
            <TimelineStep
              icon={CheckCircle}
              label="Delivered"
              date={order.deliveredAt ? new Date(order.deliveredAt) : null}
              completed={!!order.deliveredAt}
            />
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Items</h3>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/[0.06] rounded flex items-center justify-center">
                  <Package className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{item.productName}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Order Summary</h3>
        </div>
        <div className="p-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-white">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="text-white">${order.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax</span>
            <span className="text-white">${order.tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/10 pt-2 mt-2" />
          <div className="flex justify-between font-semibold">
            <span className="text-white">Total</span>
            <span className="text-val-accent">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({
  icon: Icon,
  label,
  date,
  completed,
}: {
  icon: React.ElementType;
  label: string;
  date: Date | null;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`p-2 rounded-full ${
          completed
            ? "bg-val-accent text-black"
            : "bg-white/[0.06] text-gray-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-white mt-2">{label}</p>
      {date && (
        <p className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
