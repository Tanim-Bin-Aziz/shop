"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense } from "@/types";
import { ExpenseForm, ExpenseFormValues } from "./ExpenseForm";
import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenses";

interface Props {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export function ExpenseModal({ open, onClose, expense }: Props) {
  const { mutate: create, isPending: creating } = useCreateExpense();
  const { mutate: update, isPending: updating } = useUpdateExpense();

  const handleSubmit = (values: ExpenseFormValues) => {
    if (expense) {
      update({ id: expense.id, data: values }, { onSuccess: onClose });
    } else {
      create(values, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>
        <ExpenseForm
          defaultValues={expense ?? undefined}
          onSubmit={handleSubmit}
          isLoading={creating || updating}
        />
      </DialogContent>
    </Dialog>
  );
}
