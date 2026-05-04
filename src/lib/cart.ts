import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brand: string | null;
  price: number;
  unit: string;
  image: string | null;
  minOrder: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, quantity) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity }] };
        }),
      setQty: (productId, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "buildhub-cart-v2" },
  ),
);

export function calcCart(items: CartItem[], freeAbove: number, charge: number) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = items.length === 0 ? 0 : subtotal >= freeAbove ? 0 : charge;
  return { subtotal, delivery, total: subtotal + delivery };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}