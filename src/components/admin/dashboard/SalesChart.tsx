import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart will be added next
        </div>
      </CardContent>
    </Card>
  );
}
