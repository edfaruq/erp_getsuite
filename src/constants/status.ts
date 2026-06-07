export const SALES_ORDER_STATUS = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PICKING: "PICKING",
  PACKING: "PACKING",
  SHIPPED: "SHIPPED",
  INVOICED: "INVOICED",
  PAID: "PAID",
} as const;

export type SalesOrderStatus = keyof typeof SALES_ORDER_STATUS;

export const SALES_ORDER_FLOW: SalesOrderStatus[] = [
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "PICKING",
  "PACKING",
  "SHIPPED",
  "INVOICED",
  "PAID",
];

export const PURCHASE_ORDER_STATUS = {
  DRAFT: "DRAFT",
  PENDING_RECEIPT: "PENDING_RECEIPT",
  PARTIALLY_RECEIVED: "PARTIALLY_RECEIVED",
  RECEIVED: "RECEIVED",
  BILLED: "BILLED",
  PAID: "PAID",
} as const;

export type PurchaseOrderStatus = keyof typeof PURCHASE_ORDER_STATUS;

export const PURCHASE_ORDER_FLOW: PurchaseOrderStatus[] = [
  "DRAFT",
  "PENDING_RECEIPT",
  "PARTIALLY_RECEIVED",
  "RECEIVED",
  "BILLED",
  "PAID",
];

export const INVOICE_STATUS = {
  OPEN: "OPEN",
  PAID: "PAID",
} as const;

export const VENDOR_BILL_STATUS = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  PAID: "PAID",
} as const;

export const FULFILLMENT_STATUS = {
  PICKED: "PICKED",
  PACKED: "PACKED",
  SHIPPED: "SHIPPED",
} as const;

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
  PENDING_RECEIPT: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PICKING: "bg-blue-100 text-blue-800",
  PACKING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  INVOICED: "bg-purple-100 text-purple-800",
  PAID: "bg-emerald-100 text-emerald-800",
  OPEN: "bg-orange-100 text-orange-800",
  PARTIALLY_RECEIVED: "bg-amber-100 text-amber-800",
  RECEIVED: "bg-teal-100 text-teal-800",
  BILLED: "bg-violet-100 text-violet-800",
};

export function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function canTransitionOTC(current: SalesOrderStatus, next: SalesOrderStatus): boolean {
  const transitions: Record<SalesOrderStatus, SalesOrderStatus[]> = {
    DRAFT: ["PENDING_APPROVAL"],
    PENDING_APPROVAL: ["APPROVED", "REJECTED"],
    APPROVED: ["PICKING"],
    REJECTED: [],
    PICKING: ["PACKING"],
    PACKING: ["SHIPPED"],
    SHIPPED: ["INVOICED"],
    INVOICED: ["PAID"],
    PAID: [],
  };
  return transitions[current]?.includes(next) ?? false;
}

export function canTransitionPTP(current: PurchaseOrderStatus, next: PurchaseOrderStatus): boolean {
  const transitions: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
    DRAFT: ["PENDING_RECEIPT"],
    PENDING_RECEIPT: ["PARTIALLY_RECEIVED", "RECEIVED"],
    PARTIALLY_RECEIVED: ["RECEIVED"],
    RECEIVED: ["BILLED"],
    BILLED: ["PAID"],
    PAID: [],
  };
  return transitions[current]?.includes(next) ?? false;
}
