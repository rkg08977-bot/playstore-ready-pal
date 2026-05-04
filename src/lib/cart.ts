import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product, calcDelivery } from "./products";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (productId: string, quantity: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (productId, quantity) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...s.items, { productId, quantity }] };
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
    { name: "buildhub-cart" },
  ),
);

export function getCartDetails(items: CartItem[]) {
  const lines = items
    .map((i) => {
      const product = PRODUCTS.find((p) => p.id === i.productId);
      if (!product) return null;
      return { product, quantity: i.quantity, subtotal: product.price * i.quantity };
    })
    .filter((x): x is { product: Product; quantity: number; subtotal: number } => x !== null);
  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const delivery = calcDelivery(subtotal);
  const total = subtotal + delivery;
  return { lines, subtotal, delivery, total };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}