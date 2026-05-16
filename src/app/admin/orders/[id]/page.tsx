"use client";

import { useAdminOrder, useUpdateOrderStatus } from "@/hooks/useAdminOrders";
import { OrderStatusBadge } from "../_components/OrderStatusBadge";
import { UpdateStatusDialog } from "../_components/UpdateStatusDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading } = useAdminOrder(id);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Order not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDialogOpen(true)}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Customer Info
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{order.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium capitalize">
                {order.payment_method}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-right max-w-[60%]">
                {order.shipping_address}
              </span>
            </div>
            {order.notes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notes</span>
                <span className="font-medium text-right max-w-[60%]">
                  {order.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Order Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{order.order_items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">
                ৳{Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Order Items
        </h2>
        <div className="divide-y">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-muted flex-shrink-0">
                {item.products?.image_url ? (
                  <Image
                    src={item.products.image_url}
                    alt={item.products.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                    N/A
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.products?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} × ৳{Number(item.price).toFixed(2)}
                </p>
              </div>
              <span className="font-semibold text-sm">
                ৳{(item.quantity * item.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Update Status Dialog */}
      <UpdateStatusDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        order={order}
      />
    </div>
  );
}
