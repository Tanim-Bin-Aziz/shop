"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteExpense } from "@/hooks/useExpenses";
import { Expense } from "@/types";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export function DeleteExpenseDialog({ open, onClose, expense }: Props) {
  const { mutate: deleteExpense, isPending } = useDeleteExpense();

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>&quot;{expense?.title}&quot;</strong> permanently delete
            হয়ে যাবে।
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() =>
              expense && deleteExpense(expense.id, { onSuccess: onClose })
            }
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
