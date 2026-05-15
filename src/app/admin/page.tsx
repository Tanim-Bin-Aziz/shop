import { createClient } from "@/lib/supabase/server";
import { ShoppingCart, Package, DollarSign, Star } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats in parallel
  const [
    { count: totalOrders },
    { count: totalProducts },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: "মোট অর্ডার",
      value: totalOrders ?? 0,
      icon: ShoppingCart,
      color: "violet",
    },
    {
      label: "প্রোডাক্ট",
      value: totalProducts ?? 0,
      icon: Package,
      color: "indigo",
    },
    { label: "আজকের সেলস", value: "৳0", icon: DollarSign, color: "emerald" },
    { label: "রিভিউ", value: 0, icon: Star, color: "amber" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">ড্যাশবোর্ড</h1>
        <p className="text-slate-400 text-sm mt-1">আপনার শপের সারসংক্ষেপ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-slate-900 border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">{label}</p>
              <div
                className={`w-9 h-9 rounded-xl bg-${color}-500/10 flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 text-${color}-400`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">সাম্প্রতিক অর্ডার</h2>
        {recentOrders?.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">
            কোনো অর্ডার নেই
          </p>
        ) : (
          <div className="space-y-2">
            {recentOrders?.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-slate-400 text-sm font-mono">
                  #{order.id.slice(0, 8)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === "delivered"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : order.status === "pending"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-white text-sm font-medium">
                  ৳{order.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
