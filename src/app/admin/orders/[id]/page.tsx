/**
 * Admin Order Detail Page
 *
 * Displays detailed information about a specific order.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Order detail view coming soon. This page will show:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Customer information</li>
            <li>Shipping address</li>
            <li>Order items with images</li>
            <li>Payment status</li>
            <li>Order status with timeline</li>
            <li>Status update actions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
