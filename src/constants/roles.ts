export type AppRole =
  | "SALES_REP"
  | "SALES_MANAGER"
  | "INVENTORY_MANAGER"
  | "AR_ANALYST"
  | "PURCHASING_MANAGER"
  | "AP_ANALYST"
  | "ACCOUNTING_MANAGER"
  | "CEO_CFO";

export const ALL_ROLES: AppRole[] = [
  "SALES_REP",
  "SALES_MANAGER",
  "INVENTORY_MANAGER",
  "AR_ANALYST",
  "PURCHASING_MANAGER",
  "AP_ANALYST",
  "ACCOUNTING_MANAGER",
  "CEO_CFO",
];

export const ROLE_LABELS: Record<AppRole, string> = {
  SALES_REP: "Sales Representative",
  SALES_MANAGER: "Sales Manager",
  INVENTORY_MANAGER: "Inventory Manager",
  AR_ANALYST: "A/R Analyst",
  PURCHASING_MANAGER: "Purchasing Manager",
  AP_ANALYST: "A/P Analyst",
  ACCOUNTING_MANAGER: "Accounting Manager",
  CEO_CFO: "CEO/CFO",
};

export const ROLE_COLORS: Record<AppRole, { bg: string; text: string; border: string; dot: string }> = {
  SALES_REP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  SALES_MANAGER: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  INVENTORY_MANAGER: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  AR_ANALYST: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  PURCHASING_MANAGER: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  AP_ANALYST: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  ACCOUNTING_MANAGER: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  CEO_CFO: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" },
};

export const ROLE_BANNER_COLORS: Record<AppRole, string> = {
  SALES_REP: "bg-blue-600",
  SALES_MANAGER: "bg-indigo-600",
  INVENTORY_MANAGER: "bg-amber-600",
  AR_ANALYST: "bg-green-600",
  PURCHASING_MANAGER: "bg-purple-600",
  AP_ANALYST: "bg-rose-600",
  ACCOUNTING_MANAGER: "bg-orange-600",
  CEO_CFO: "bg-slate-600",
};
