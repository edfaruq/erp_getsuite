"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PurchaseOrderForm } from "@/components/ptp/PurchaseOrderForm";
import { useRoleStore } from "@/store/role.store";
import { useVendors } from "@/hooks/ptp/useVendors";

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const activeRole = useRoleStore((s) => s.activeRole);
  const { vendors, loading: vendorsLoading } = useVendors();
  const [items, setItems] = useState<{ id: string; displayName: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/inventory/items").then((r) => r.json()).then((d) => setItems(d.data ?? []));
  }, []);

  const handleSubmit = async (data: { vendorId: string; location?: string; memo?: string; items: { itemId: string; rate: number; quantity: number; amount: number }[] }) => {
    setError(null);
    const res = await fetch("/api/ptp/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) {
      const result = await res.json();
      router.push(`/purchase-orders/${result.data.id}`);
    } else {
      const result = await res.json();
      setError(result.error ?? "Failed to create purchase order");
    }
  };

  return (
    <div>
      <PageHeader title="Create Purchase Order" description="Enter vendor and line item details." />
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {vendorsLoading ? (
        <p className="text-muted-foreground">Loading vendors...</p>
      ) : (
        <PurchaseOrderForm
          vendors={vendors.map((v) => ({ id: v.id, name: v.name }))}
          items={items}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
