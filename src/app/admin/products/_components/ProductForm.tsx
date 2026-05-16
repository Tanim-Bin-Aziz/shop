/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food & Grocery",
  "Beauty & Health",
  "Sports",
  "Home & Kitchen",
  "Books",
  "Toys",
  "Other",
];

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Price must be > 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  category: z.string().optional(),
  image_url: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Product>;
  onSubmit: (values: ProductFormValues) => void;
  isLoading?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, ProductFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? undefined,
      stock: defaultValues?.stock ?? 0,
      category: defaultValues?.category ?? "",
      image_url: defaultValues?.image_url ?? "",
    },
  });

  const imageUrl = watch("image_url");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g. Wireless Headphones"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="price">Price (৳) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price")}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            {...register("stock")}
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-xs text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label>Category</Label>
        <Select
          defaultValue={defaultValues?.category ?? ""}
          onValueChange={(val) => setValue("category", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Describe the product..."
          rows={3}
        />
      </div>

      {/* Image */}
      <div className="space-y-1">
        <Label>Product Image</Label>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue("image_url", url)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {defaultValues?.id ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
