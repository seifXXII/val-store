"use client";

/**
 * Admin Coupons Page
 *
 * List and manage discount coupons.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CouponsHeader } from "@/components/admin/coupons/CouponsHeader";
import { CouponsTable } from "@/components/admin/coupons/CouponsTable";
import { CouponFormDialog } from "@/components/admin/coupons/CouponFormDialog";

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
      <CouponsHeader
        onAdd={() => {
          setEditingCoupon(null);
          setDialogOpen(true);
        }}
      />
      <CouponsTable
        coupons={coupons ?? []}
        onEdit={(id) => {
          setEditingCoupon(id);
          setDialogOpen(true);
        }}
        onToggle={(id) => toggleMutation.mutate({ id })}
        onDelete={(id) => deleteMutation.mutate({ id })}
      />
      <CouponFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={!!editingCoupon}
        isPending={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
