/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Expense } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export const EXPENSE_CATEGORIES = [
  "Product Cost",
  "Delivery",
  "Salary",
  "Rent",
  "Utility",
  "Marketing",
  "Other",
];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().min(0.01, "Amount must be > 0"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Expense>;
  onSubmit: (values: ExpenseFormValues) => void;
  isLoading?: boolean;
}

export function ExpenseForm({ defaultValues, onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormValues, unknown, ExpenseFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: defaultValues?.title ?? "",
      amount: defaultValues?.amount ?? undefined,
      category: defaultValues?.category ?? "",
      date: defaultValues?.date ?? new Date().toISOString().split("T")[0],
      note: defaultValues?.note ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="e.g. Office Rent"
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Amount & Date */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="amount">Amount (৳) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...register("amount")}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label>Category *</Label>
        <Select
          defaultValue={defaultValues?.category ?? ""}
          onValueChange={(val) => setValue("category", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Note */}
      <div className="space-y-1">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          {...register("note")}
          placeholder="Optional note..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {defaultValues?.id ? "Update Expense" : "Add Expense"}
      </Button>
    </form>
  );
}
