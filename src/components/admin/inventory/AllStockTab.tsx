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
import { Edit } from "lucide-react";

export interface InventoryVariant {
  variantId: string;
  sku: string;
  productName: string;
  size: string | null;
  color: string | null;
  stockQuantity: number;
}

interface AllStockTabProps {
  variants: InventoryVariant[];
  onAdjust: (variant: InventoryVariant) => void;
}

export function AllStockTab({ variants, onAdjust }: AllStockTabProps) {
  return (
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
          {variants.map((v) => (
            <TableRow key={v.variantId}>
              <TableCell className="font-medium">{v.productName}</TableCell>
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
                <Button variant="ghost" size="icon" onClick={() => onAdjust(v)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
