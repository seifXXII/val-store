import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactFormPlaceholder() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Send us a Message</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Contact form coming soon. In the meantime, please email us at{" "}
          <a
            href="mailto:support@valstore.com"
            className="text-primary hover:underline"
          >
            support@valstore.com
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
