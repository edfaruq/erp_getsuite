import { PurchaseOrderStatus } from "@/constants/status";

export interface PurchaseOrderLine {
  id?: string;
  itemId: string;
  itemName?: string;
  dept?: string;
  class?: string;
  rate: number;
  quantity: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName?: string;
  date: string;
  location: string;
  currency: string;
  memo?: string;
  status: PurchaseOrderStatus;
  createdBy: string;
  approvedBy?: string;
  items?: PurchaseOrderLine[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderInput {
  vendorId: string;
  date?: string;
  location?: string;
  currency?: string;
  memo?: string;
  items: Omit<PurchaseOrderLine, "id" | "itemName">[];
}

export interface VendorBill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName?: string;
  purchaseOrderId?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "PENDING_APPROVAL" | "APPROVED" | "PAID";
  memo?: string;
}

export interface BillPayment {
  id: string;
  paymentNumber: string;
  vendorId: string;
  billId: string;
  date: string;
  amount: number;
  apAccount: string;
  account: string;
  memo?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  poCount?: number;
  billCount?: number;
}

export interface CreateBillInput {
  vendorId: string;
  purchaseOrderId?: string;
  dueDate: string;
  amount: number;
  memo?: string;
}

export interface CreateBillPaymentInput {
  vendorId: string;
  billId: string;
  amount: number;
  apAccount?: string;
  account?: string;
  memo?: string;
}
