"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  paymentNumber: string;
  customer?: { name: string };
  date: string;
  amount: number;
  account: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/otc/payments").then((r) => r.json()).then((d) => { setPayments(d.data ?? []); setLoading(false); });
  }, []);

  const columns: Column<Payment>[] = [
    { key: "paymentNumber", header: "Payment #" },
    { key: "customer", header: "Customer", render: (r) => r.customer?.name ?? "—" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
    { key: "account", header: "Account" },
  ];

  return (
    <div>
      <PageHeader title="Customer Payments" description="Accept and record customer payments against invoices." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={payments} keyField="id" emptyMessage="No payments recorded." />}
    </div>
  );
}
