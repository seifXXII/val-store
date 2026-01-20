"use client";

/**
 * Addresses Page
 *
 * Manage shipping addresses using tRPC.
 */

import { useState } from "react";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const utils = trpc.useUtils();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data: addresses = [], isLoading } =
    trpc.public.address.list.useQuery();

  const createMutation = trpc.public.address.create.useMutation({
    onSuccess: () => {
      utils.public.address.list.invalidate();
      toast("Address added");
      setIsDialogOpen(false);
    },
    onError: (err) => {
      toast.error("Failed to add address", { description: err.message });
    },
  });

  const updateMutation = trpc.public.address.update.useMutation({
    onSuccess: () => {
      utils.public.address.list.invalidate();
      toast("Address updated");
      setIsDialogOpen(false);
      setEditingAddress(null);
    },
  });

  const deleteMutation = trpc.public.address.delete.useMutation({
    onSuccess: () => {
      utils.public.address.list.invalidate();
      toast("Address deleted");
    },
  });

  const setDefaultMutation = trpc.public.address.setDefault.useMutation({
    onSuccess: () => {
      utils.public.address.list.invalidate();
      toast("Default address updated");
    },
  });

  const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      country: formData.get("country") as string,
      phone: formData.get("phone") as string,
    };

    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-8 bg-muted rounded w-32 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="h-48 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Addresses</h2>
          <p className="text-muted-foreground">
            Manage your shipping addresses.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAddress(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingAddress?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  defaultValue={editingAddress?.street}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={editingAddress?.city}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    defaultValue={editingAddress?.state}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    defaultValue={editingAddress?.zipCode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    defaultValue={editingAddress?.country || "Egypt"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={editingAddress?.phone}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No addresses saved yet.</p>
            <Button
              variant="link"
              onClick={() => setIsDialogOpen(true)}
              className="mt-2"
            >
              Add your first address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={address.isDefault ? "border-primary" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{address.name}</CardTitle>
                  {address.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.zipCode}
                  <br />
                  {address.country}
                </CardDescription>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDefaultMutation.mutate({ id: address.id })
                      }
                      disabled={setDefaultMutation.isPending}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingAddress({
                        ...address,
                        phone: address.phone ?? "",
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => deleteMutation.mutate({ id: address.id })}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
