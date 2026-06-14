"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { BillForm } from "@/components/ptp/BillForm";
import { useRoleStore } from "@/store/role.store";
import { useVendors } from "@/hooks/ptp/useVendors";
import { PurchaseOrder } from "@/types/ptp.types";

export default function NewBillPage() {
  const router = useRouter();
  const activeRole = useRoleStore((s) => s.activeRole);
  const { vendors, loading: vendorsLoading } = useVendors();
  const [receivablePOs, setReceivablePOs] = useState<{ id: string; poNumber: string; vendorId: string; amount: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ptp/purchase-orders?status=RECEIVED")
      .then((r) => r.json())
      .then((d) => {
        const pos = (d.data ?? []) as PurchaseOrder[];
        setReceivablePOs(pos.map((po) => ({
          id: po.id,
          poNumber: po.poNumber,
          vendorId: po.vendorId,
          amount: po.items?.reduce((s, i) => s + i.amount, 0) ?? 0,
        })));
      });
  }, []);

  const handleSubmit = async (data: { vendorId: string; purchaseOrderId?: string; dueDate: string; amount: number; memo?: string }) => {
    setError(null);
    const res = await fetch("/api/ptp/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) {
      const result = await res.json();
      router.push(`/bills/${result.data.id}`);
    } else {
      const result = await res.json();
      setError(result.error ?? "Failed to create bill");
    }
  };

  return (
    <div>
      <PageHeader title="Enter Standalone Bill" description="Create a new vendor bill or bill a received PO." />
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {vendorsLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <BillForm
          vendors={vendors.map((v) => ({ id: v.id, name: v.name }))}
          purchaseOrders={receivablePOs}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
