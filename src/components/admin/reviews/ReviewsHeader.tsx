import { Badge } from "@/components/ui/badge";

interface ReviewsHeaderProps {
  pendingCount: number;
}

export function ReviewsHeader({ pendingCount }: ReviewsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Reviews</h1>
      {pendingCount > 0 && (
        <Badge variant="secondary" className="text-sm">
          {pendingCount} pending approval
        </Badge>
      )}
    </div>
  );
}
