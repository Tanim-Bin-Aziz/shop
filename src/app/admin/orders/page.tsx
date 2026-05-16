"use client";

import { useAdminOrders } from "@/hooks/useAdminOrders";
import { OrdersTable } from "./_components/OrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "..." : `${orders?.length ?? 0} total orders`}
          </p>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <OrdersTable data={orders ?? []} />
      )}
    </div>
  );
}
