import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";

type Period = 7 | 30 | 90;

interface AnalyticsHeaderProps {
  days: Period;
  onDaysChange: (days: Period) => void;
  onExport: () => void;
  exportDisabled: boolean;
}

export function AnalyticsHeader({
  days,
  onDaysChange,
  onExport,
  exportDisabled,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your store performance and key metrics.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {([7, 30, 90] as Period[]).map((p) => (
          <Button
            key={p}
            variant={days === p ? "default" : "outline"}
            size="sm"
            onClick={() => onDaysChange(p)}
          >
            {p}d
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={exportDisabled}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}

export type { Period };
