import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Product, Review } from "@/types";
import type { ProductInsert, ProductUpdate } from "@/types/index";
import { toast } from "sonner";

// ─── Queries ────────────────────────────────────────────

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
  });
}

export function useReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, avatar_url)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });
}

// ─── Admin Mutations ─────────────────────────────────────

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Product;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductUpdate }) => {
      const supabase = createClient();
      const { data: updated, error } = await supabase
        .from("products")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as Product;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
