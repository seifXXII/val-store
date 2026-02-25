/**
 * Shipping Information Page
 */

import { Truck, Clock, Globe, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Shipping Information | Valkyrie",
  description:
    "Learn about our shipping options, delivery times, and policies.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        We offer fast, reliable shipping to get your order to you as quickly as
        possible.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Standard Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">$5.99</p>
            <p className="text-muted-foreground">5-7 business days</p>
            <p className="text-sm text-muted-foreground mt-2">
              Free on orders over $100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Express Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">$14.99</p>
            <p className="text-muted-foreground">2-3 business days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              International Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">$24.99+</p>
            <p className="text-muted-foreground">7-14 business days</p>
            <p className="text-sm text-muted-foreground mt-2">
              Rates vary by destination
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All orders include tracking. You&apos;ll receive an email with
              your tracking number once your order ships.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Shipping Policy</h2>
        <ul>
          <li>Orders are processed within 1-2 business days</li>
          <li>Delivery times are estimates and may vary</li>
          <li>We ship to all 50 US states and internationally</li>
          <li>Signature may be required for high-value orders</li>
        </ul>
      </div>
    </div>
  );
}
