/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface SummaryStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  product_id: string;
  name: string;
  image_url: string | null;
  total_sold: number;
  total_revenue: number;
}

export interface RecentOrder {
  id: string;
  full_name: string;
  total: number;
  status: string;
  created_at: string;
}

// ─── Summary Stats ────────────────────────────────────────
export function useSummaryStats() {
  return useQuery({
    queryKey: ["sales-summary"],
    queryFn: async () => {
      const supabase = createClient();

      const [ordersRes, allOrderUsersRes] = await Promise.all([
        supabase.from("orders").select("total, status, user_id"),
        supabase.from("orders").select("user_id"),
      ]);

      const totalCustomers = new Set(
        allOrderUsersRes.data?.map((o) => o.user_id) ?? [],
      ).size;

      if (ordersRes.error) throw new Error(ordersRes.error.message);

      const orders = ordersRes.data ?? [];
      const delivered = orders.filter((o) => o.status === "delivered");
      const pending = orders.filter((o) => o.status === "pending");
      const totalRevenue = delivered.reduce(
        (sum, o) => sum + Number(o.total),
        0,
      );

      return {
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers,
        avgOrderValue: orders.length
          ? orders.reduce((s, o) => s + Number(o.total), 0) / orders.length
          : 0,
        pendingOrders: pending.length,
        deliveredOrders: delivered.length,
      } as SummaryStats;
    },
  });
}

// ─── Revenue by Day (last 30 days) ───────────────────────
export function useRevenueChart() {
  return useQuery({
    queryKey: ["sales-revenue-chart"],
    queryFn: async () => {
      const supabase = createClient();
      const from = new Date();
      from.setDate(from.getDate() - 29);

      const { data, error } = await supabase
        .from("orders")
        .select("total, created_at, status")
        .gte("created_at", from.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);

      // Group by date
      const map: Record<string, { revenue: number; orders: number }> = {};

      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const key = d.toISOString().split("T")[0];
        map[key] = { revenue: 0, orders: 0 };
      }

      (data ?? []).forEach((o) => {
        const key = o.created_at.split("T")[0];
        if (map[key]) {
          map[key].orders += 1;
          if (o.status === "delivered") {
            map[key].revenue += Number(o.total);
          }
        }
      });

      return Object.entries(map).map(([date, val]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        ...val,
      })) as RevenueByDay[];
    },
  });
}

// ─── Top Products ─────────────────────────────────────────
export function useTopProducts() {
  return useQuery({
    queryKey: ["sales-top-products"],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("order_items")
        .select(`product_id, quantity, price, products ( name, image_url )`)
        .limit(200);

      if (error) throw new Error(error.message);

      const map: Record<
        string,
        {
          name: string;
          image_url: string | null;
          total_sold: number;
          total_revenue: number;
        }
      > = {};

      (data ?? []).forEach((item: any) => {
        const id = item.product_id;
        if (!map[id]) {
          map[id] = {
            name: item.products?.name ?? "Unknown",
            image_url: item.products?.image_url ?? null,
            total_sold: 0,
            total_revenue: 0,
          };
        }
        map[id].total_sold += item.quantity;
        map[id].total_revenue += item.quantity * Number(item.price);
      });

      return Object.entries(map)
        .map(([product_id, val]) => ({ product_id, ...val }))
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 5) as TopProduct[];
    },
  });
}

// ─── Recent Orders ────────────────────────────────────────
export function useRecentOrders() {
  return useQuery({
    queryKey: ["sales-recent-orders"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("id, full_name, total, status, created_at")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw new Error(error.message);
      return data as RecentOrder[];
    },
  });
}
