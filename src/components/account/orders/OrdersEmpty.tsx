import Link from "next/link";
import { Package } from "lucide-react";

export function OrdersEmpty() {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-lg py-12 text-center">
      <Package className="h-12 w-12 mx-auto text-gray-600 mb-4" />
      <p className="text-gray-400 mb-4">No orders yet.</p>
      <Link href="/collections/all" className="text-val-accent hover:underline">
        Start shopping
      </Link>
    </div>
  );
}
