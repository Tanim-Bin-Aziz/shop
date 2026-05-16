"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminOrder } from "@/hooks/useAdminOrders";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, RefreshCw } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useRouter } from "next/navigation";

interface Actions {
  onUpdateStatus: (order: AdminOrder) => void;
}

export function getColumns({
  onUpdateStatus,
}: Actions): ColumnDef<AdminOrder>[] {
  return [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{row.getValue<string>("id").slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("full_name")}</p>
          <p className="text-xs text-muted-foreground">{row.original.phone}</p>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold">
          ৳{Number(row.getValue("total")).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "payment_method",
      header: "Payment",
      cell: ({ row }) => (
        <span className="capitalize text-sm">
          {row.getValue("payment_method")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OrderStatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const router = useRouter();
        return (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onUpdateStatus(order)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
