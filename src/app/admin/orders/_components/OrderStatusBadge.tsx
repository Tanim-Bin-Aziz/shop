import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/hooks/useAdminOrders";

const config: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Pending", variant: "outline" },
  processing: { label: "Processing", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const colorMap: Record<OrderStatus, string> = {
  pending: "border-yellow-400 text-yellow-600 bg-yellow-50",
  processing: "border-blue-400 text-blue-600 bg-blue-50",
  shipped: "border-purple-400 text-purple-600 bg-purple-50",
  delivered: "border-green-400 text-green-600 bg-green-50",
  cancelled: "border-red-400 text-red-600 bg-red-50",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label } = config[status] ?? config.pending;
  return (
    <Badge
      variant="outline"
      className={`capitalize font-medium ${colorMap[status] ?? ""}`}
    >
      {label}
    </Badge>
  );
}
