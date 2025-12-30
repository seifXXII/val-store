import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PricingSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <CardDescription>Set your product pricing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              type="number"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salePrice">Sale Price (Optional)</Label>
            <Input
              id="salePrice"
              type="number"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costPrice">Cost Price</Label>
            <Input
              id="costPrice"
              type="number"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
