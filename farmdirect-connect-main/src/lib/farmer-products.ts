// Local store for products the farmer adds from their dashboard.
// Persists in localStorage so the demo survives reloads. Swap to Lovable Cloud later.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category } from "./data";

export type FarmerProduct = {
  id: string;
  name: string;
  category: Category;
  price: number;
  stockKg: number;
  unit: string;
  image?: string; // data URL
  createdAt: number;
};

type State = {
  items: FarmerProduct[];
  add: (p: Omit<FarmerProduct, "id" | "createdAt">) => void;
  remove: (id: string) => void;
};

export const useFarmerProducts = create<State>()(
  persist(
    (set) => ({
      items: [],
      add: (p) =>
        set((s) => ({
          items: [
            { ...p, id: `f-${Date.now()}`, createdAt: Date.now() },
            ...s.items,
          ],
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: "kk-farmer-products" },
  ),
);
