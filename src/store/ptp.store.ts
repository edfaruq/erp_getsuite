import { create } from "zustand";

interface PTPStore {
  selectedPOId: string | null;
  setSelectedPOId: (id: string | null) => void;
}

export const usePTPStore = create<PTPStore>((set) => ({
  selectedPOId: null,
  setSelectedPOId: (id) => set({ selectedPOId: id }),
}));
