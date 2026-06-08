"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { PaymentForm } from "@/components/otc/PaymentForm";
import { usePayments } from "@/hooks/otc/usePayments";
import { useInvoices } from "@/hooks/otc/useInvoices";
import { useRoleStore } from "@/store/role.store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CustomerPayment } from "@/types/otc.types";

export default function PaymentsPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const { payments, loading, refetch } = usePayments();
  const { invoices: openInvoices, refetch: refetchInvoices } = useInvoices("OPEN");

  const handlePayment = async (data: { customerId: string; invoiceId: string; amount: number; account?: string; arAccount?: string; memo?: string }) => {
    const res = await fetch("/api/otc/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) {
      refetch();
      refetchInvoices();
    }
  };

  const columns: Column<CustomerPayment & { customer?: { name: string } }>[] = [
    { key: "paymentNumber", header: "Payment #" },
    { key: "customer", header: "Customer", render: (r) => r.customer?.name ?? "—" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
    { key: "account", header: "Account" },
  ];

  return (
    <div>
      <PageHeader title="Customer Payments" description="Accept and record customer payments against invoices." />
      <PaymentForm openInvoices={openInvoices} onSubmit={handlePayment} />
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <DataTable columns={columns} data={payments} keyField="id" emptyMessage="No payments recorded." />
      )}
    </div>
  );
}
