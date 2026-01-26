"use client";

/**
 * Admin Customers Page
 *
 * List all customers with order stats and view details.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Eye, ShoppingBag, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  const { data, isLoading } = trpc.admin.customers.list.useQuery({
    search: search || undefined,
    limit: 100,
  });

  const { data: customerDetail, isLoading: isLoadingDetail } =
    trpc.admin.customers.getById.useQuery(
      { id: selectedCustomerId! },
      { enabled: !!selectedCustomerId }
    );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-10 w-64 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const { customers = [], total = 0 } = data ?? {};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">{total} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-72 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Customers Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No customers found
                </TableCell>
              </TableRow>
            )}
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.image ?? undefined} />
                      <AvatarFallback>
                        {c.name?.charAt(0).toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {c.email}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(c.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{c.orderCount}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${c.totalSpent.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCustomerId(c.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Customer Detail Dialog */}
      <Dialog
        open={!!selectedCustomerId}
        onOpenChange={(open) => !open && setSelectedCustomerId(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {isLoadingDetail ? (
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
                  <h3 className="text-lg font-semibold">
                    {customerDetail.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {customerDetail.email}
                  </p>
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
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
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
    </div>
  );
}
