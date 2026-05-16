"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useSummaryStats } from "@/hooks/useSalesData";
import { ExpenseSummaryCards } from "./_components/ExpenseSummaryCards";
import { ExpenseCharts } from "./_components/ExpenseCharts";
import { ExpenseTable } from "./_components/ExpenseTable";
import { ExpenseModal } from "./_components/ExpenseModal";
import { DeleteExpenseDialog } from "./_components/DeleteExpenseDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Plus } from "lucide-react";
import { Expense } from "@/types";

export default function ExpensesPage() {
  const { data: expenses, isLoading } = useExpenses();
  const { data: salesStats } = useSummaryStats();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Expense | null>(null);

  const openEdit = (expense: Expense) => {
    setSelected(expense);
    setModalOpen(true);
  };

  const openDelete = (expense: Expense) => {
    setSelected(expense);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Expense Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "..." : `${expenses?.length ?? 0} total expenses`}
            </p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <>
          <ExpenseSummaryCards
            expenses={expenses ?? []}
            totalRevenue={salesStats?.totalRevenue ?? 0}
          />
          <ExpenseCharts expenses={expenses ?? []} />
          <ExpenseTable
            data={expenses ?? []}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </>
      )}

      <ExpenseModal open={modalOpen} onClose={closeModal} expense={selected} />
      <DeleteExpenseDialog
        open={deleteOpen}
        onClose={closeDelete}
        expense={selected}
      />
    </div>
  );
}
