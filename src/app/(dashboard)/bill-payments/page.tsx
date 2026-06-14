"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { BillPaymentForm } from "@/components/ptp/BillPaymentForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BillPayment, VendorBill } from "@/types/ptp.types";
import { useRoleStore } from "@/store/role.store";

export default function BillPaymentsPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const [payments, setPayments] = useState<BillPayment[]>([]);
  const [approvedBills, setApprovedBills] = useState<VendorBill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    Promise.all([
      fetch("/api/ptp/payments").then((r) => r.json()),
      fetch("/api/ptp/bills?status=APPROVED").then((r) => r.json()),
    ]).then(([paymentsRes, billsRes]) => {
      setPayments(paymentsRes.data ?? []);
      setApprovedBills(billsRes.data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePayment = async (data: { billId: string; vendorId: string; amount: number; apAccount: string; account: string; memo?: string }) => {
    const res = await fetch("/api/ptp/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) fetchData();
  };

  const columns: Column<BillPayment>[] = [
    { key: "paymentNumber", header: "Payment #" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
    { key: "account", header: "Account" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Bill Payments" description="Pay approved vendor bills." />
      <BillPaymentForm bills={approvedBills} onSubmit={handlePayment} />
      <div>
        <h3 className="font-medium mb-4">Payment History</h3>
        {loading ? <p className="text-muted-foreground">Loading...</p> : (
          <DataTable columns={columns} data={payments} keyField="id" emptyMessage="No bill payments recorded." />
        )}
      </div>
    </div>
  );
}
