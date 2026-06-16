import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppRole } from "@/constants/roles";

interface RoleStore {
  activeRole: AppRole;
  setRole: (role: AppRole) => void;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      activeRole: "SALES_REP",
      setRole: (role) => set({ activeRole: role }),
    }),
    { name: "getsuite-active-role" }
  )
);
