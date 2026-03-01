import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddressesHeader({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">Addresses</h2>
        <p className="text-gray-400">Manage your shipping addresses.</p>
      </div>
      <Button
        onClick={onAddClick}
        className="bg-val-accent hover:bg-val-accent/90 text-black font-medium"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Address
      </Button>
    </div>
  );
}
