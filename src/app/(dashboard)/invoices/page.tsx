"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Invoice } from "@/types/otc.types";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/otc/invoices").then((r) => r.json()).then((d) => { setInvoices(d.data ?? []); setLoading(false); });
  }, []);

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
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={invoices} keyField="id" />}
    </div>
  );
}
