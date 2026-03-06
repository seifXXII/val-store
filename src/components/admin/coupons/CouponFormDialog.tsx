import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CouponFormDialog({
  open,
  onOpenChange,
  isEditing,
  isPending,
  onSubmit,
}: CouponFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Coupon" : "Create New Coupon"}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {isEditing
              ? "Update the details and restrictions for this coupon code."
              : "Create a new discount code for your customers to use at checkout."}
          </p>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Core Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-semibold">
                  Coupon Code
                </Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="e.g. SUMMER20"
                  className="uppercase font-mono text-lg tracking-wider"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Internal note: 20% off summer collection"
                  className="resize-none h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="discountType"
                    className="text-sm font-semibold"
                  >
                    Discount Type
                  </Label>
                  <Select name="discountType" defaultValue="percentage">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="discountValue"
                    className="text-sm font-semibold"
                  >
                    Value
                  </Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    step="0.01"
                    placeholder="20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Restrictions */}
            <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-muted/50">
              <h4 className="font-semibold mb-2">
                Usage Limits & Restrictions
              </h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minPurchaseAmount" className="text-sm">
                    Min. Purchase Amount ($)
                  </Label>
                  <Input
                    id="minPurchaseAmount"
                    name="minPurchaseAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDiscountAmount" className="text-sm">
                    Max Discount Amount ($)
                  </Label>
                  <Input
                    id="maxDiscountAmount"
                    name="maxDiscountAmount"
                    type="number"
                    step="0.01"
                    placeholder="No limit"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only applies to percentage discounts
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usageLimit" className="text-sm">
                    Total Usage Limit
                  </Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    placeholder="Unlimited"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt" className="text-sm">
                    Expiration Date
                  </Label>
                  <Input id="expiresAt" name="expiresAt" type="date" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base font-medium">
                Active Status
              </Label>
              <p className="text-sm text-muted-foreground">
                Turn off to temporarily disable this coupon without deleting it.
              </p>
            </div>
            <Switch id="isActive" name="isActive" defaultChecked />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Coupon"
                  : "Create Coupon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
