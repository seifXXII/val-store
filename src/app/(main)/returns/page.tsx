/**
 * Returns & Exchanges Page
 */

import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Returns & Exchanges | Val Store",
  description: "Learn about our hassle-free return and exchange policy.",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        We want you to love your purchase. If something isn&apos;t right,
        we&apos;ve got you covered with our 30-day return policy.
      </p>

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
              Return any unworn item within 30 days of delivery for a full
              refund.
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
              Start a return from your account or contact us. We&apos;ll send
              you a prepaid label.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Return Eligibility</h2>

        <div className="grid md:grid-cols-2 gap-8 not-prose mb-8">
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                Eligible for Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Unworn items with tags attached</li>
                <li>• Items in original packaging</li>
                <li>• Items returned within 30 days</li>
                <li>• Defective or damaged items</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <XCircle className="h-5 w-5" />
                Not Eligible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Worn or washed items</li>
                <li>• Items without tags</li>
                <li>• Final sale items</li>
                <li>• Items returned after 30 days</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2>How to Start a Return</h2>
        <ol>
          <li>Log into your account and go to Order History</li>
          <li>Select the order and items you wish to return</li>
          <li>Choose return or exchange and select a reason</li>
          <li>Print the prepaid shipping label</li>
          <li>Drop off at any carrier location</li>
        </ol>

        <p>
          Refunds are processed within 5-7 business days after we receive your
          return.
        </p>
      </div>
    </div>
  );
}
