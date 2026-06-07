"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { VendorBill } from "@/types/ptp.types";

export default function BillApprovalsPage() {
  const [bills, setBills] = useState<VendorBill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = () => {
    fetch("/api/ptp/bills").then((r) => r.json()).then((d) => {
      setBills((d.data ?? []).filter((b: VendorBill) => b.status === "PENDING_APPROVAL"));
      setLoading(false);
    });
  };

  useEffect(() => { fetchBills(); }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/ptp/bills/${id}/approve`, { method: "POST" });
    fetchBills();
  };

  return (
    <div>
      <PageHeader title="Bill Approvals" description="Approve standalone vendor bills." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : bills.length === 0 ? (
        <p className="text-muted-foreground">No bills pending approval.</p>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => (
            <div key={bill.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{bill.billNumber}</p>
                <p className="text-sm text-muted-foreground">{bill.vendorName} — {formatCurrency(bill.amount)} — Due {formatDate(bill.dueDate)}</p>
              </div>
              <StatusBadge status={bill.status} />
              <Button size="sm" onClick={() => handleApprove(bill.id)}>Approve</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
