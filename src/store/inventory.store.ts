import { create } from "zustand";

interface InventoryStore {
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),
}));
