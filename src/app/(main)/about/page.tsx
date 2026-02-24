/**
 * About Page
 */

import { Heart, Shield, Leaf, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "About Us | Valkyrie",
  description:
    "Learn about Valkyrie and our mission to bring premium streetwear to everyone.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Valkyrie</h1>
        <p className="text-lg text-muted-foreground">
          Premium streetwear for the modern individual. We believe fashion
          should be accessible, sustainable, and expressive.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Heart className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Quality First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Every piece is crafted with premium materials and attention to
              detail.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Authentic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              100% authentic products, sourced directly from brands and
              designers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Leaf className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Sustainable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We&apos;re committed to reducing our environmental impact through
              eco-friendly practices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Built by and for the streetwear community, with your style in
              mind.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="prose dark:prose-invert max-w-3xl mx-auto">
        <h2>Our Story</h2>
        <p>
          Valkyrie was founded with a simple mission: to make premium streetwear
          accessible to everyone. What started as a small online boutique has
          grown into a destination for fashion-forward individuals seeking
          quality, style, and authenticity.
        </p>

        <h2>Our Promise</h2>
        <p>
          We stand behind every product we sell. From the moment you browse our
          collection to the day your order arrives at your door, we&apos;re
          committed to providing an exceptional experience. If you&apos;re ever
          not satisfied, our customer service team is here to help.
        </p>

        <h2>Join the Community</h2>
        <p>
          Follow us on social media to stay up to date with new drops, style
          inspiration, and exclusive offers. We love seeing how you style your
          Valkyrie pieces – tag us in your photos!
        </p>
      </div>
    </div>
  );
}
