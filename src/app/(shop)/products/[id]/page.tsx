import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductDetails from "@/components/shop/ProductDetails";
import type { Metadata } from "next";
import type { Product } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("name, description, image_url")
    .eq("id", id)
    .single();

  if (!data) return { title: "Product Not Found" };

  return {
    title: `${data.name} | SuperShop`,
    description: data.description,
    openGraph: {
      images: data.image_url ? [data.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetails product={product as Product} />;
}
