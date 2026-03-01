import { RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReturnsOptions() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            30-Day Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Return any unworn item within 30 days of delivery for a full refund.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Free Exchanges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Need a different size or color? We offer free exchanges on all
            orders.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Easy Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start a return from your account or contact us. We&apos;ll send you
            a prepaid label.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
