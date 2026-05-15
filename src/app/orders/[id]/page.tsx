import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "অপেক্ষমান",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: Clock,
    step: 1,
  },
  processing: {
    label: "প্রস্তুত হচ্ছে",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    icon: Package,
    step: 2,
  },
  shipped: {
    label: "পাঠানো হয়েছে",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    icon: Truck,
    step: 3,
  },
  delivered: {
    label: "ডেলিভারি হয়েছে",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    icon: CheckCircle2,
    step: 4,
  },
  cancelled: {
    label: "বাতিল",
    color: "text-red-400",
    bg: "bg-red-400/10",
    icon: XCircle,
    step: 0,
  },
};

const STEPS = ["pending", "processing", "shipped", "delivered"];

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  products:
    | { name: string; image_url: string | null; category: string | null }
    | { name: string; image_url: string | null; category: string | null }[]
    | null;
};
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?from=/orders");

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id, quantity, price,
        products ( name, image_url, category )
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const status =
    STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const currentStep = status.step;
  const date = new Date(order.created_at).toLocaleString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getProduct = (raw: OrderItem["products"]) =>
    Array.isArray(raw) ? raw[0] : raw;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              অর্ডার #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl ${status.bg}`}
        >
          <StatusIcon className={`w-5 h-5 ${status.color}`} />
          <p className={`font-semibold text-sm ${status.color}`}>
            {status.label}
          </p>
        </div>

        {/* Progress Tracker */}
        {order.status !== "cancelled" && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              অর্ডার ট্র্যাকিং
            </h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-border mx-8" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-primary mx-8 transition-all"
                style={{
                  width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                }}
              />
              {STEPS.map((step, i) => {
                const cfg = STATUS_CONFIG[step as keyof typeof STATUS_CONFIG];
                const Icon = cfg.icon;
                const done = currentStep > i + 1;
                const active = currentStep === i + 1;
                return (
                  <div
                    key={step}
                    className="flex flex-col items-center gap-2 z-10"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        done
                          ? "bg-primary border-primary"
                          : active
                            ? "bg-primary/20 border-primary"
                            : "bg-background border-border"
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${done || active ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium text-center leading-tight ${done || active ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              অর্ডারের আইটেম
            </h2>
          </div>
          <div className="divide-y divide-border">
            {(order.order_items as OrderItem[]).map((item) => {
              const product = getProduct(item.products);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    {product?.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name ?? ""}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {product?.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product?.category}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      × {item.quantity} পিস
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground flex-shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Price Summary */}
          <div className="px-5 py-4 bg-muted/30 border-t border-border space-y-2">
            {(() => {
              const subtotal = (order.order_items as OrderItem[]).reduce(
                (s: number, i: OrderItem) => s + i.price * i.quantity,
                0,
              );
              const delivery = order.total - subtotal;
              return (
                <>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>সাবটোটাল</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="text-emerald-500">
                      {delivery === 0 ? "ফ্রি" : `৳${delivery}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
                    <span>মোট</span>
                    <span>৳{order.total.toLocaleString()}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            ডেলিভারি তথ্য
          </h2>
          {[
            { icon: Phone, label: "ফোন", value: order.phone },
            { icon: MapPin, label: "ঠিকানা", value: order.shipping_address },
            {
              icon: CreditCard,
              label: "পেমেন্ট",
              value:
                order.payment_method === "cod"
                  ? "ক্যাশ অন ডেলিভারি"
                  : order.payment_method,
            },
          ].map(({ icon: Icon, label, value }) =>
            value ? (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm text-foreground mt-0.5">{value}</p>
                </div>
              </div>
            ) : null,
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-4">
            <p className="text-xs text-amber-400 font-medium mb-1">
              বিশেষ নির্দেশনা
            </p>
            <p className="text-sm text-foreground">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
