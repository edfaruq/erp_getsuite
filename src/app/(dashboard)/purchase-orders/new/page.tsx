"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PurchaseOrderForm } from "@/components/ptp/PurchaseOrderForm";
import { useRoleStore } from "@/store/role.store";

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const activeRole = useRoleStore((s) => s.activeRole);
  const [items, setItems] = useState<{ id: string; displayName: string }[]>([]);

  useEffect(() => {
    fetch("/api/inventory/items").then((r) => r.json()).then((d) => setItems(d.data ?? []));
  }, []);

  const vendors = [
    { id: "vendor-apple", name: "Apple Store" },
    { id: "vendor-bist", name: "Bist Electronics" },
    { id: "vendor-dell", name: "Dell Technologies" },
    { id: "vendor-cisco", name: "Cisco Systems" },
    { id: "vendor-office", name: "Office Depot" },
  ];

  const handleSubmit = async (data: { vendorId: string; location?: string; memo?: string; items: { itemId: string; rate: number; quantity: number; amount: number }[] }) => {
    const res = await fetch("/api/ptp/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) router.push("/purchase-orders");
  };

  return (
    <div>
      <PageHeader title="Create Purchase Order" description="Enter vendor and line item details." />
      <PurchaseOrderForm vendors={vendors} items={items} onSubmit={handleSubmit} />
    </div>
  );
}
