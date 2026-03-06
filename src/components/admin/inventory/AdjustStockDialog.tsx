import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { type InventoryVariant } from "./AllStockTab";

const CHANGE_TYPES = [
  { value: "restock", label: "Restock" },
  { value: "adjustment", label: "Manual Adjustment" },
  { value: "damaged", label: "Damaged/Lost" },
  { value: "return", label: "Return" },
] as const;

type ChangeType = (typeof CHANGE_TYPES)[number]["value"];

interface AdjustStockDialogProps {
  variant: InventoryVariant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AdjustStockDialog({
  variant,
  open,
  onOpenChange,
  onSuccess,
}: AdjustStockDialogProps) {
  const [newQuantity, setNewQuantity] = useState("");
  const [changeType, setChangeType] = useState<ChangeType>("adjustment");
  const [reason, setReason] = useState("");

  const adjustMutation = trpc.admin.inventory.adjustStock.useMutation({
    onSuccess: () => {
      toast.success("Stock adjusted successfully");
      onSuccess();
      onOpenChange(false);
      setNewQuantity("");
      setReason("");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variant) return;

    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    adjustMutation.mutate({
      variantId: variant.variantId,
      newQuantity: qty,
      changeType,
      reason: reason.trim() || undefined,
    });
  };

  // Reset form when variant changes
  if (variant && newQuantity === "") {
    setNewQuantity(String(variant.stockQuantity));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
        </DialogHeader>
        {variant && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{variant.productName}</p>
              <p className="text-sm text-muted-foreground">
                SKU: {variant.sku}
                {variant.size && ` • Size: ${variant.size}`}
                {variant.color && ` • Color: ${variant.color}`}
              </p>
              <p className="text-sm mt-1">
                Current Stock:{" "}
                <span className="font-semibold">{variant.stockQuantity}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newQuantity">New Quantity</Label>
              <Input
                id="newQuantity"
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Reason for Change</Label>
              <Select
                value={changeType}
                onValueChange={(v) => setChangeType(v as ChangeType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANGE_TYPES.map((ct) => (
                    <SelectItem key={ct.value} value={ct.value}>
                      {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Notes (optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Additional details..."
                rows={2}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={adjustMutation.isPending}
            >
              {adjustMutation.isPending ? "Saving..." : "Update Stock"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
