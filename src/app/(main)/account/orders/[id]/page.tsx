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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Order not found.</p>
          <Button asChild>
            <Link href="/account/orders">View All Orders</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Order #{orderId.slice(-8)}</h2>
          <p className="text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge className={`ml-auto ${statusColors[order.status] || ""}`}>
          {order.status}
        </Badge>
      </div>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <TimelineStep
              icon={Package}
              label="Order Placed"
              date={new Date(order.createdAt)}
              completed={true}
            />
            <div className="flex-1 h-1 bg-muted rounded">
              <div
                className={`h-full bg-primary rounded ${
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
            <div className="flex-1 h-1 bg-muted rounded">
              <div
                className={`h-full bg-primary rounded ${
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
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>${order.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
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
          completed ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium mt-2">{label}</p>
      {date && (
        <p className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
