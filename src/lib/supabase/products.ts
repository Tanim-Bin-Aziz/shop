import { createClient } from "@/lib/supabase/client";
import type { Product, ProductInsert, ProductUpdate } from "@/types/index";

const supabase = createClient();

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createProduct(product: ProductInsert): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(
  id: string,
  product: ProductUpdate,
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(fileName);

  return publicUrl;
}
