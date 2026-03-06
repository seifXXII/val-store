import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href="mailto:support@valstore.com"
            className="text-primary hover:underline"
          >
            support@valstore.com
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>+1 (555) 123-4567</p>
          <p className="text-sm text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>123 Fashion Street</p>
          <p>New York, NY 10001</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Monday - Friday: 9am - 6pm</p>
          <p>Saturday: 10am - 4pm</p>
          <p>Sunday: Closed</p>
        </CardContent>
      </Card>
    </div>
  );
}
