"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatCurrency, formatDate } from "@/lib/utils";

interface BillPayment {
  id: string;
  paymentNumber: string;
  vendor?: { name: string };
  date: string;
  amount: number;
  account: string;
}

export default function BillPaymentsPage() {
  const [payments, setPayments] = useState<BillPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ptp/payments").then((r) => r.json()).then((d) => { setPayments(d.data ?? []); setLoading(false); });
  }, []);

  const columns: Column<BillPayment>[] = [
    { key: "paymentNumber", header: "Payment #" },
    { key: "vendor", header: "Vendor", render: (r) => r.vendor?.name ?? "—" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
    { key: "account", header: "Account" },
  ];

  return (
    <div>
      <PageHeader title="Bill Payments" description="Pay approved vendor bills." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={payments} keyField="id" emptyMessage="No bill payments recorded." />}
    </div>
  );
}
