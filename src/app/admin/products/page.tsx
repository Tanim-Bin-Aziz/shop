"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductsTable } from "./_components/ProductsTable";
import { ProductModal } from "./_components/ProductModal";
import { DeleteConfirmDialog } from "./_components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Plus } from "lucide-react";
import type { Product } from "@/types/index";

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const openEdit = (product: Product) => {
    setSelected(product);
    setModalOpen(true);
  };

  const openDelete = (product: Product) => {
    setSelected(product);
    setDeleteOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Product Manager
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "..." : `${products?.length ?? 0} products total`}
            </p>
          </div>
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table / Skeleton */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <ProductsTable
          data={products ?? []}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Modals */}
      <ProductModal open={modalOpen} onClose={closeModal} product={selected} />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={closeDelete}
        product={selected}
      />
    </div>
  );
}
