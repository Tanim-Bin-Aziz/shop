"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  useUpdateOrderStatus,
  type AdminOrder,
  type OrderStatus,
} from "@/hooks/useAdminOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Loader2 } from "lucide-react";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

interface Props {
  open: boolean;
  onClose: () => void;
  order: AdminOrder | null;
}

export function UpdateStatusDialog({ open, onClose, order }: Props) {
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? "pending");
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleSave = () => {
    if (!order) return;
    updateStatus({ id: order.id, status }, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">
              {order?.id.slice(0, 8)}...
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Status</span>
            {order && <OrderStatusBadge status={order.status} />}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">New Status</p>
            <Select
              defaultValue={order?.status}
              onValueChange={(val) => setStatus(val as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
