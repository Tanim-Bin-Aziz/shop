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
import { useDeleteProduct } from "@/hooks/useProducts";
import type { Product } from "@/types/index";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function DeleteConfirmDialog({ open, onClose, product }: Props) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleConfirm = () => {
    if (!product) return;
    deleteProduct(product.id, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>&quot;{product?.name}&quot;</strong> permanently delete হয়ে
            যাবে। This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
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
