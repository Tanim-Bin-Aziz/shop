export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
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
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  created_at: string;
}

export type ExpenseInsert = {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string | null;
};

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}
export type ExpenseUpdate = Partial<ExpenseInsert>;
export type ProductUpdate = Partial<ProductInsert>;
