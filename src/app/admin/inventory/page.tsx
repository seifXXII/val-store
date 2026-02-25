"use client";

/**
 * Admin Inventory Page
 *
 * View stock levels, adjust quantities, and view history.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import { Package, AlertTriangle, History, Edit } from "lucide-react";

const CHANGE_TYPES = [
  { value: "restock", label: "Restock" },
  { value: "adjustment", label: "Manual Adjustment" },
  { value: "damaged", label: "Damaged/Lost" },
  { value: "return", label: "Return" },
] as const;

type ChangeType = (typeof CHANGE_TYPES)[number]["value"];

interface AdjustDialogProps {
  variant: {
    variantId: string;
    sku: string;
    productName: string;
    size: string | null;
    color: string | null;
    stockQuantity: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function AdjustStockDialog({
  variant,
  open,
  onOpenChange,
  onSuccess,
}: AdjustDialogProps) {
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

export default function AdminInventoryPage() {
  const [adjustingVariant, setAdjustingVariant] = useState<{
    variantId: string;
    sku: string;
    productName: string;
    size: string | null;
    color: string | null;
    stockQuantity: number;
  } | null>(null);

  const { data: allVariants = [], isLoading } =
    trpc.admin.inventory.listVariants.useQuery();
  const { data: lowStock = [] } = trpc.admin.inventory.getLowStock.useQuery({
    threshold: 10,
  });
  const { data: logs = [] } = trpc.admin.inventory.getLogs.useQuery({
    limit: 50,
  });

  const utils = trpc.useUtils();

  const handleAdjustSuccess = () => {
    utils.admin.inventory.listVariants.invalidate();
    utils.admin.inventory.getLowStock.invalidate();
    utils.admin.inventory.getLogs.invalidate();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        {lowStock.length > 0 && (
          <Badge variant="destructive" className="text-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {lowStock.length} low stock items
          </Badge>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            <Package className="h-4 w-4 mr-1" />
            All Stock ({allVariants.length})
          </TabsTrigger>
          <TabsTrigger value="low">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Low Stock ({lowStock.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-1" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {allVariants.map((v) => (
                  <TableRow key={v.variantId}>
                    <TableCell className="font-medium">
                      {v.productName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{v.sku}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[v.size, v.color].filter(Boolean).join(" / ") || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          v.stockQuantity <= 0
                            ? "destructive"
                            : v.stockQuantity <= 10
                              ? "default"
                              : "secondary"
                        }
                      >
                        {v.stockQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAdjustingVariant(v)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="low">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No low stock items
                    </TableCell>
                  </TableRow>
                )}
                {lowStock.map((v) => (
                  <TableRow key={v.variantId}>
                    <TableCell className="font-medium">
                      {v.productName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{v.sku}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[v.size, v.color].filter(Boolean).join(" / ") || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          v.stockQuantity <= 0 ? "destructive" : "default"
                        }
                      >
                        {v.stockQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAdjustingVariant(v)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No inventory changes logged yet
                    </TableCell>
                  </TableRow>
                )}
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(log.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.productName ?? "—"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.variantSku ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.changeType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={
                          log.quantityChange > 0
                            ? "text-green-600"
                            : log.quantityChange < 0
                              ? "text-red-600"
                              : ""
                        }
                      >
                        {log.quantityChange > 0 ? "+" : ""}
                        {log.quantityChange}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({log.previousQuantity} → {log.newQuantity})
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.createdByName ?? "System"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {log.reason ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AdjustStockDialog
        variant={adjustingVariant}
        open={!!adjustingVariant}
        onOpenChange={(open) => !open && setAdjustingVariant(null)}
        onSuccess={handleAdjustSuccess}
      />
    </div>
  );
}
