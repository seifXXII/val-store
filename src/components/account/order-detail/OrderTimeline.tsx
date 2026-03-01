import { Package, Truck, CheckCircle } from "lucide-react";

interface OrderTimelineProps {
  createdAt: Date;
  shippedAt: Date | null;
  deliveredAt: Date | null;
}

export function OrderTimeline({
  createdAt,
  shippedAt,
  deliveredAt,
}: OrderTimelineProps) {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-lg">
      <div className="p-5 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Order Status</h3>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4">
          <TimelineStep
            icon={Package}
            label="Order Placed"
            date={new Date(createdAt)}
            completed={true}
          />
          <div className="flex-1 h-1 bg-white/10 rounded overflow-hidden">
            <div
              className={`h-full bg-val-accent rounded transition-all ${
                shippedAt ? "w-full" : "w-0"
              }`}
            />
          </div>
          <TimelineStep
            icon={Truck}
            label="Shipped"
            date={shippedAt ? new Date(shippedAt) : null}
            completed={!!shippedAt}
          />
          <div className="flex-1 h-1 bg-white/10 rounded overflow-hidden">
            <div
              className={`h-full bg-val-accent rounded transition-all ${
                deliveredAt ? "w-full" : "w-0"
              }`}
            />
          </div>
          <TimelineStep
            icon={CheckCircle}
            label="Delivered"
            date={deliveredAt ? new Date(deliveredAt) : null}
            completed={!!deliveredAt}
          />
        </div>
      </div>
    </div>
  );
}

function TimelineStep({
  icon: Icon,
  label,
  date,
  completed,
}: {
  icon: React.ElementType;
  label: string;
  date: Date | null;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`p-2 rounded-full ${
          completed
            ? "bg-val-accent text-black"
            : "bg-white/[0.06] text-gray-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-white mt-2">{label}</p>
      {date && (
        <p className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
