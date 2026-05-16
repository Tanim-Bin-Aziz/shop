import { RecentOrder } from "@/hooks/useSalesData";
import { OrderStatusBadge } from "../../orders/_components/OrderStatusBadge";
import { OrderStatus } from "@/hooks/useAdminOrders";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Props {
  data: RecentOrder[];
}

export function RecentOrders({ data }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-base">Recent Orders</h2>
          <p className="text-xs text-muted-foreground">Last 8 orders</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/orders")}
        >
          View All
        </Button>
      </div>

      <div className="divide-y">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No orders yet.
          </p>
        )}
        {data.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{order.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status as OrderStatus} />
              <span className="font-semibold text-sm">
                ৳{Number(order.total).toFixed(2)}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
