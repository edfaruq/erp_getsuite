import { create } from "zustand";

interface OTCStore {
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
}

export const useOTCStore = create<OTCStore>((set) => ({
  selectedOrderId: null,
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
}));
