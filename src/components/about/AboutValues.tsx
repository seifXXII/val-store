import { Heart, Shield, Leaf, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutValues() {
  return (
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
            100% authentic products, sourced directly from brands and designers.
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
            Built by and for the streetwear community, with your style in mind.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
