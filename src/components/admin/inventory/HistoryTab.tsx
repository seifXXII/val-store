import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InventoryLog {
  id: string;
  createdAt: Date | string;
  productName: string | null;
  variantSku: string | null;
  changeType: string;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  createdByName: string | null;
  reason: string | null;
}

interface HistoryTabProps {
  logs: InventoryLog[];
}

export function HistoryTab({ logs }: HistoryTabProps) {
  return (
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
  );
}
