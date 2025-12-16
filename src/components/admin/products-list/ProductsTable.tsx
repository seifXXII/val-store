"use client";

import { trpc } from "@/lib/trpc";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function ProductsTable() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.admin.products.list.useQuery();

  // Delete mutation with optimistic update
  const deleteMutation = trpc.admin.products.delete.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.admin.products.list.cancel();

      // Snapshot previous value
      const previousProducts = utils.admin.products.list.getData();

      // Optimistically remove from list
      utils.admin.products.list.setData(undefined, (old) =>
        old?.filter((p) => p.id !== variables.id)
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      utils.admin.products.list.setData(undefined, context?.previousProducts);
      toast.error("Failed to delete product");
    },
    onSettled: () => {
      // Always refetch after error or success
      utils.admin.products.list.invalidate();
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
  });

  // Toggle status mutation with optimistic update
  const toggleMutation = trpc.admin.products.toggleStatus.useMutation({
    onMutate: async (variables) => {
      await utils.admin.products.list.cancel();
      const previousProducts = utils.admin.products.list.getData();

      // Optimistically toggle status
      utils.admin.products.list.setData(undefined, (old) =>
        old?.map((p) =>
          p.id === variables.id ? { ...p, isActive: !p.isActive } : p
        )
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      utils.admin.products.list.setData(undefined, context?.previousProducts);
      toast.error("Failed to update product status");
    },
    onSettled: () => {
      utils.admin.products.list.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-md border p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-12 w-12 rounded-md bg-muted" />
                </TableCell>
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categoryName || "Uncategorized"}</TableCell>
                <TableCell>
                  ${parseFloat(product.basePrice).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      product.totalStock < 10
                        ? "text-destructive font-medium"
                        : "text-foreground"
                    }
                  >
                    {product.totalStock}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMutation.mutate({ id: product.id })}
                    disabled={toggleMutation.isPending}
                  >
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Button>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          deleteMutation.mutate({ id: product.id })
                        }
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
