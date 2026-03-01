import { Truck, Clock, Globe, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShippingOptions() {
  return (
    <>
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
            All orders include tracking. You&apos;ll receive an email with your
            tracking number once your order ships.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
