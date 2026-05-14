// src/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  image_url: string;
  category: string;
  stock: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          if (existing) {
            // ✅ Duplicate: add quantities but NEVER exceed stock
            const newQty = Math.min(
              existing.quantity + item.quantity,
              item.stock, // cap at stock
            );
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty } : i,
              ),
            };
          }

          // ✅ New item: quantity can't exceed stock
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(item.quantity, item.stock) },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id
                ? { ...i, quantity: Math.min(quantity, i.stock) } // ✅ stock cap
                : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: "supershop-cart" },
  ),
);
