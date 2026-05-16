import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string | null;
  };
}

export interface AdminOrder {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  shipping_address: string;
  payment_method: string;
  notes: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItem[];
}

// ─── Queries ─────────────────────────────────────────────

export function useAdminOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: ["admin-orders", status],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products ( name, image_url )
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as AdminOrder[];
    },
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products ( name, image_url )
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data as AdminOrder;
    },
  });
}

// ─── Mutations ────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-order"] });
      toast.success("Order status updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
