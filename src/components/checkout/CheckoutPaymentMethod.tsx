import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type PaymentMethod = "stripe" | "cash_on_delivery";

export function CheckoutPaymentMethod({
  paymentMethod,
  onPaymentMethodChange,
}: {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (val: PaymentMethod) => void;
}) {
  return (
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
          onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
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
            <RadioGroupItem value="stripe" id="pm-stripe" className="mt-1" />
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
  );
}
