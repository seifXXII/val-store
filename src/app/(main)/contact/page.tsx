/**
 * Contact Page
 */

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Contact Us | Valkyrie",
  description: "Get in touch with Valkyrie. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Have questions? We&apos;d love to hear from you. Send us a message and
        we&apos;ll respond as soon as possible.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
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
              <p className="text-sm text-muted-foreground">
                Mon-Fri, 9am-6pm EST
              </p>
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
      </div>
    </div>
  );
}
