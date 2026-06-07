export type { AppRole } from "@/constants/roles";
export type { MenuItem } from "@/constants/roleMenus";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReminderItem {
  id: string;
  label: string;
  count: number;
  href: string;
  priority?: "high" | "medium" | "low";
}
