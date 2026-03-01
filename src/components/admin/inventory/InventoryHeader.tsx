import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface InventoryHeaderProps {
  lowStockCount: number;
}

export function InventoryHeader({ lowStockCount }: InventoryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Inventory</h1>
      {lowStockCount > 0 && (
        <Badge variant="destructive" className="text-sm">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {lowStockCount} low stock items
        </Badge>
      )}
    </div>
  );
}
