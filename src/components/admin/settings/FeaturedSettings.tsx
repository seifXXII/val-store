"use client";

/**
 * Featured Settings Component
 *
 * Manage featured products and categories for homepage.
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, GripVertical, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface FeaturedItem {
  id: string;
  itemId: string;
  displayOrder: number;
}

export function FeaturedSettings() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch featured products
  const {
    data: featuredProducts,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = trpc.admin.settings.getFeaturedItems.useQuery(
    { section: "homepage_featured" },
    { staleTime: 1000 * 60 }
  );

  // Fetch featured categories
  const {
    data: featuredCategories,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = trpc.admin.settings.getFeaturedItems.useQuery(
    { section: "homepage_categories" },
    { staleTime: 1000 * 60 }
  );

  // Remove featured item mutation
  const removeFeatured = trpc.admin.settings.removeFeaturedItem.useMutation({
    onSuccess: () => {
      toast.success("Item removed from featured");
      refetchProducts();
      refetchCategories();
    },
    onError: (err: { message: string }) => {
      toast.error(`Failed to remove: ${err.message}`);
    },
  });

  const handleRemove = (id: string) => {
    removeFeatured.mutate({ id });
  };

  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>
                Products displayed prominently on your homepage
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products to add..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Featured Items List */}
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="space-y-2">
              {featuredProducts.map((item: FeaturedItem, index: number) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <p className="font-medium">Product #{index + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {item.itemId.slice(0, 8)}...
                    </p>
                  </div>
                  <Badge variant="outline">Order: {item.displayOrder}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <p>No featured products yet</p>
              <p className="text-sm">
                Add products to display on your homepage
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Featured Categories</CardTitle>
              <CardDescription>
                Category cards displayed on your homepage
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {featuredCategories && featuredCategories.length > 0 ? (
            <div className="space-y-2">
              {featuredCategories.map((item: FeaturedItem, index: number) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <p className="font-medium">Category #{index + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {item.itemId.slice(0, 8)}...
                    </p>
                  </div>
                  <Badge variant="outline">Order: {item.displayOrder}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <p>No featured categories yet</p>
              <p className="text-sm">
                Add categories to display on your homepage
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              💡
            </div>
            <div className="text-sm">
              <p className="font-medium">Pro Tips</p>
              <ul className="mt-1 text-muted-foreground space-y-1">
                <li>• Drag items to reorder their display position</li>
                <li>
                  • Featured products appear in the &quot;Featured&quot; section
                  on homepage
                </li>
                <li>• Recommended: 4-8 featured products, 3-6 categories</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
