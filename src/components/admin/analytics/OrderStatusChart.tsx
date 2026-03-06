import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", // Amber
  processing: "#3b82f6", // Blue
  paid: "#10b981", // Emerald (more distinct from shipped)
  shipped: "#8b5cf6", // Violet
  delivered: "#22c55e", // Green
  cancelled: "#ef4444", // Red
  refunded: "#64748b", // Slate
};

interface OrderStatusChartProps {
  data: Array<{ status: string; count: number }>;
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  return (
    <Card className="lg:col-span-2 border-muted/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">
          Order Status Breakdown
        </CardTitle>
        <CardDescription>Distribution of current order states</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] || "#64748b"}
                    className="hover:opacity-80 transition-opacity duration-200 outline-none"
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm font-medium text-foreground ml-1 capitalize">
                    {value}
                  </span>
                )}
              />
              <Tooltip
                formatter={(value: number) => [`${value} Orders`, "Count"]}
                labelFormatter={(label: string) =>
                  label ? label.charAt(0).toUpperCase() + label.slice(1) : ""
                }
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border)/0.5)",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                  color: "hsl(var(--foreground))",
                  padding: "8px 12px",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[320px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl border-muted/30">
            <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground/50"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <p className="font-medium">No order data available</p>
            <p className="text-sm">
              There are no orders in the selected period.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
