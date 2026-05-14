import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Product, Review } from "@/types";

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
