import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Waiting for confirmation",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10",
    icon: XCircle,
  },
};

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?from=/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id, total, status, created_at,
      shipping_address, payment_method, full_name,
      order_items (
        quantity, price,
        products ( name, image_url )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Total {orders?.length ?? 0} orders
          </p>
        </div>

        {/* Empty State */}
        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Orders Found
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              You haven&lsquo;t placed any orders yet.
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status =
                STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ??
                STATUS_CONFIG.pending;
              const StatusIcon = status.icon;
              const date = new Date(order.created_at).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" },
              );

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Order Number
                        </p>
                        <p className="text-sm font-mono font-semibold text-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="px-5 py-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex -space-x-2">
                        {order.order_items.slice(0, 3).map((item, i) => {
                          const product = Array.isArray(item.products)
                            ? item.products[0]
                            : item.products;
                          return (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-xl border-2 border-background overflow-hidden bg-muted flex-shrink-0"
                            >
                              {product?.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name ?? ""}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {order.order_items.length > 3 && (
                          <div className="w-10 h-10 rounded-xl border-2 border-background bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              +{order.order_items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-1">
                          {order.order_items
                            .map((i) => {
                              const p = Array.isArray(i.products)
                                ? i.products[0]
                                : i.products;
                              return p?.name;
                            })
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {date}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{order.order_items.length} Items</span>
                      <span>
                        {order.payment_method === "cod"
                          ? "Cash on Delivery"
                          : order.payment_method}
                      </span>
                    </div>
                    <p className="font-bold text-foreground">
                      ৳{order.total.toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
