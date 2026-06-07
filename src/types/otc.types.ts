import { SalesOrderStatus } from "@/constants/status";

export interface SalesOrderLine {
  id?: string;
  itemId: string;
  itemName?: string;
  dept?: string;
  class?: string;
  priceLevel?: string;
  rate: number;
  quantity: number;
  taxCode?: string;
  amount: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  date: string;
  location: string;
  currency: string;
  memo?: string;
  status: SalesOrderStatus;
  createdBy: string;
  approvedBy?: string;
  items?: SalesOrderLine[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalesOrderInput {
  customerId: string;
  date?: string;
  location?: string;
  currency?: string;
  memo?: string;
  items: Omit<SalesOrderLine, "id" | "itemName">[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  customerId: string;
  customerName?: string;
  date: string;
  dueDate: string;
  subtotal: number;
  total: number;
  status: "OPEN" | "PAID";
}

export interface CustomerPayment {
  id: string;
  paymentNumber: string;
  customerId: string;
  invoiceId: string;
  date: string;
  amount: number;
  account: string;
  arAccount: string;
  memo?: string;
}
