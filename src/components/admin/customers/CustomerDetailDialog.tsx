import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { trpc } from "@/lib/trpc";

interface CustomerDetailDialogProps {
  customerId: string | null;
  onClose: () => void;
}

export function CustomerDetailDialog({
  customerId,
  onClose,
}: CustomerDetailDialogProps) {
  const { data: customerDetail, isLoading } =
    trpc.admin.customers.getById.useQuery(
      { id: customerId! },
      { enabled: !!customerId }
    );

  return (
    <Dialog open={!!customerId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        ) : customerDetail ? (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customerDetail.image ?? undefined} />
                <AvatarFallback className="text-xl">
                  {customerDetail.name?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{customerDetail.name}</h3>
                <p className="text-muted-foreground">{customerDetail.email}</p>
                <p className="text-sm text-muted-foreground">
                  Joined{" "}
                  {format(new Date(customerDetail.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {customerDetail.orderCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${customerDetail.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </div>

            {/* Orders */}
            <div>
              <h4 className="font-semibold mb-3">Order History</h4>
              {customerDetail.orders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {customerDetail.orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM d, yyyy")} •{" "}
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
