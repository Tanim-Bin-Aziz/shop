export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category?: string | null;
  image_url?: string | null;
};

export type ProductUpdate = Partial<ProductInsert>;
