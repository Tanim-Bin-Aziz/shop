"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/types/index";
import { ProductForm, type ProductFormValues } from "./ProductForm";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ open, onClose, product }: Props) {
  const { mutate: create, isPending: creating } = useCreateProduct();
  const { mutate: update, isPending: updating } = useUpdateProduct();

  const handleSubmit = (values: ProductFormValues) => {
    if (product) {
      update({ id: product.id, data: values }, { onSuccess: onClose });
    } else {
      create(values, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          defaultValues={product ?? undefined}
          onSubmit={handleSubmit}
          isLoading={creating || updating}
        />
      </DialogContent>
    </Dialog>
  );
}
