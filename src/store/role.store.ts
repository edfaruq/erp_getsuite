import { create } from "zustand";
import { AppRole } from "@/constants/roles";

interface RoleStore {
  activeRole: AppRole;
  setRole: (role: AppRole) => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  activeRole: "SALES_REP",
  setRole: (role) => set({ activeRole: role }),
}));
