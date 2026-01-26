"use client";

/**
 * Admin Coupons Page
 *
 * List and manage discount coupons.
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Plus, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminCouponsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null);

  const { data: coupons, isLoading } = trpc.admin.coupons.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.admin.coupons.create.useMutation({
    onSuccess: () => {
      utils.admin.coupons.list.invalidate();
      setDialogOpen(false);
      toast.success("Coupon created");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.coupons.update.useMutation({
    onSuccess: () => {
      utils.admin.coupons.list.invalidate();
      setDialogOpen(false);
      setEditingCoupon(null);
      toast.success("Coupon updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.coupons.delete.useMutation({
    onSuccess: () => {
      utils.admin.coupons.list.invalidate();
      toast.success("Coupon deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleMutation = trpc.admin.coupons.toggleActive.useMutation({
    onSuccess: () => {
      utils.admin.coupons.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || undefined,
      discountType: formData.get("discountType") as "percentage" | "fixed",
      discountValue: formData.get("discountValue") as string,
      minPurchaseAmount:
        (formData.get("minPurchaseAmount") as string) || undefined,
      maxDiscountAmount:
        (formData.get("maxDiscountAmount") as string) || undefined,
      usageLimit: formData.get("usageLimit")
        ? parseInt(formData.get("usageLimit") as string)
        : undefined,
      isActive: formData.get("isActive") === "on",
      expiresAt: formData.get("expiresAt")
        ? new Date(formData.get("expiresAt") as string)
        : undefined,
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
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
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button
          onClick={() => {
            setEditingCoupon(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No coupons yet. Create your first one!
                </TableCell>
              </TableRow>
            )}
            {coupons?.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-semibold">
                      {coupon.code}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyCode(coupon.code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {coupon.description && (
                    <p className="text-sm text-muted-foreground">
                      {coupon.description}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`}
                </TableCell>
                <TableCell>
                  {coupon.usageCount}
                  {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                </TableCell>
                <TableCell>
                  {coupon.expiresAt
                    ? format(new Date(coupon.expiresAt), "MMM d, yyyy")
                    : "Never"}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? "default" : "secondary"}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCoupon(coupon.id);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleMutation.mutate({ id: coupon.id })}
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate({ id: coupon.id })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                name="code"
                placeholder="SUMMER20"
                className="uppercase"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="20% off summer collection"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select name="discountType" defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Value</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPurchaseAmount">Min. Purchase ($)</Label>
                <Input
                  id="minPurchaseAmount"
                  name="minPurchaseAmount"
                  type="number"
                  step="0.01"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscountAmount">Max Discount ($)</Label>
                <Input
                  id="maxDiscountAmount"
                  name="maxDiscountAmount"
                  type="number"
                  step="0.01"
                  placeholder="No limit"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  placeholder="Unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input id="expiresAt" name="expiresAt" type="date" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="isActive" name="isActive" defaultChecked />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingCoupon
                  ? "Update Coupon"
                  : "Create Coupon"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
