import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CheckoutNoAddress() {
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
