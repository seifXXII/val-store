"use client";

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
import { Label } from "@/components/ui/label";

type Variant = {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

export function VariantsSection() {
  const [variants, setVariants] = useState<Variant[]>([
    { id: "1", size: "", color: "", stock: 0, sku: "" },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        size: "",
        color: "",
        stock: 0,
        sku: "",
      },
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>Add size and color combinations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="grid gap-4 sm:grid-cols-4 p-4 border rounded-lg"
          >
            <div className="space-y-2">
              <Label>Size</Label>
              <Input placeholder="M" />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input placeholder="Black" />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input placeholder="VAL-001-M-BLK" />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addVariant}>
          Add Variant
        </Button>
      </CardContent>
    </Card>
  );
}
