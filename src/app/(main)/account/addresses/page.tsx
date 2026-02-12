"use client";

/**
 * Addresses Page
 *
 * Manage shipping addresses using tRPC.
 */

import { useState } from "react";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <div className="h-8 bg-white/[0.06] rounded w-32 animate-pulse" />
          <div className="h-10 bg-white/[0.06] rounded w-32 animate-pulse" />
        </div>
        <div className="h-48 bg-white/[0.06] rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Addresses</h2>
          <p className="text-gray-400">Manage your shipping addresses.</p>
        </div>
        <Button
          onClick={() => {
            setEditingAddress(null);
            setIsDialogOpen(true);
          }}
          className="bg-val-accent hover:bg-val-accent/90 text-black font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-zinc-900 border border-white/10 rounded-lg py-12 text-center">
          <MapPin className="h-12 w-12 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No addresses saved yet.</p>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="mt-2 text-val-accent hover:underline text-sm"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-zinc-900 border rounded-lg p-4 ${
                address.isDefault ? "border-val-accent/40" : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-white">
                  {address.name}
                </h3>
                {address.isDefault && (
                  <span className="text-xs bg-val-accent/15 text-val-accent px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                {address.street}
                <br />
                {address.city}, {address.state} {address.zipCode}
                <br />
                {address.country}
              </p>
              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDefaultMutation.mutate({ id: address.id })
                    }
                    disabled={setDefaultMutation.isPending}
                    className="border-white/10 text-gray-300 hover:bg-white/[0.04] hover:text-white text-xs"
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
                  className="text-gray-400 hover:text-white hover:bg-white/[0.04]"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => deleteMutation.mutate({ id: address.id })}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setIsDialogOpen(false);
              setEditingAddress(null);
            }}
          />
          {/* Dialog */}
          <div className="relative bg-zinc-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <FormField
                id="name"
                label="Full Name"
                defaultValue={editingAddress?.name}
                required
              />
              <FormField
                id="street"
                label="Street Address"
                defaultValue={editingAddress?.street}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="city"
                  label="City"
                  defaultValue={editingAddress?.city}
                  required
                />
                <FormField
                  id="state"
                  label="State/Province"
                  defaultValue={editingAddress?.state}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="zipCode"
                  label="ZIP/Postal Code"
                  defaultValue={editingAddress?.zipCode}
                />
                <FormField
                  id="country"
                  label="Country"
                  defaultValue={editingAddress?.country || "Egypt"}
                />
              </div>
              <FormField
                id="phone"
                label="Phone"
                defaultValue={editingAddress?.phone}
                required
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-white/10 text-gray-300 hover:bg-white/[0.04] hover:text-white"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingAddress(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-val-accent hover:bg-val-accent/90 text-black font-medium"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({
  id,
  label,
  defaultValue,
  required,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        name={id}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-val-accent/50 focus:border-val-accent/50 transition-colors"
      />
    </div>
  );
}
