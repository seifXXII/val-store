import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CouponsHeaderProps {
  onAdd: () => void;
}

export function CouponsHeader({ onAdd }: CouponsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Coupons</h1>
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Coupon
      </Button>
    </div>
  );
}
