"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { InvoiceCreateForm } from "@/components/otc/InvoiceCreateForm";
import { useInvoices } from "@/hooks/otc/useInvoices";
import { useSalesOrders } from "@/hooks/otc/useSalesOrders";
import { useRoleStore } from "@/store/role.store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Invoice } from "@/types/otc.types";

export default function InvoicesPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const { invoices, loading, refetch } = useInvoices();
  const { orders: shippedOrders, refetch: refetchOrders } = useSalesOrders("SHIPPED");

  const handleCreateInvoice = async (data: { salesOrderId: string; customerId: string; dueDate: string }) => {
    const res = await fetch("/api/otc/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) {
      refetch();
      refetchOrders();
    }
  };

  const columns: Column<Invoice>[] = [
    { key: "invoiceNumber", header: "Invoice #", render: (r) => <Link href={`/invoices/${r.id}`} className="text-primary hover:underline">{r.invoiceNumber}</Link> },
    { key: "customerName", header: "Customer" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "dueDate", header: "Due", render: (r) => formatDate(r.dueDate) },
    { key: "total", header: "Total", render: (r) => formatCurrency(r.total) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Invoices" description="Manage customer invoices and billing." />
      <InvoiceCreateForm orders={shippedOrders} onSubmit={handleCreateInvoice} />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={invoices} keyField="id" />}
    </div>
  );
}
