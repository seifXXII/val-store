import Link from "next/link";
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
import { AppRouter } from "@/server";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type AddressList = RouterOutputs["public"]["address"]["list"];

export function CheckoutAddressSelection({
  addresses,
  selectedAddressId,
  onAddressChange,
}: {
  addresses: AddressList;
  selectedAddressId: string;
  onAddressChange: (val: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Address</CardTitle>
        <CardDescription>Default address is preselected.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAddressId}
          onValueChange={onAddressChange}
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
  );
}
