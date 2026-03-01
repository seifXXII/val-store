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
import { MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export interface CouponRow {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: string;
  usageCount: number;
  usageLimit: number | null;
  expiresAt: Date | string | null;
  isActive: boolean;
}

interface CouponsTableProps {
  coupons: CouponRow[];
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CouponsTable({
  coupons,
  onEdit,
  onToggle,
  onDelete,
}: CouponsTableProps) {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  return (
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
          {coupons.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No coupons yet. Create your first one!
              </TableCell>
            </TableRow>
          )}
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="font-mono font-semibold">{coupon.code}</code>
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
                    <DropdownMenuItem onClick={() => onEdit(coupon.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggle(coupon.id)}>
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(coupon.id)}
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
  );
}
