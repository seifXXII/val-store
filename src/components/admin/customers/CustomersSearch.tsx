import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomersSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomersSearch({ value, onChange }: CustomersSearchProps) {
  return (
    <div className="relative w-72 mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
