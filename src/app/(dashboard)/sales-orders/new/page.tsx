"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SalesOrderForm } from "@/components/otc/SalesOrderForm";
import { useRoleStore } from "@/store/role.store";
import { useCustomers } from "@/hooks/otc/useCustomers";

export default function NewSalesOrderPage() {
  const router = useRouter();
  const activeRole = useRoleStore((s) => s.activeRole);
  const { customers } = useCustomers();
  const [items, setItems] = useState<{ id: string; displayName: string }[]>([]);

  useEffect(() => {
    fetch("/api/inventory/items").then((r) => r.json()).then((d) => setItems(d.data ?? []));
  }, []);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { customerId: string; location?: string; memo?: string; items: { itemId: string; rate: number; quantity: number; amount: number }[] }) => {
    setError(null);
    const res = await fetch("/api/otc/sales-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) {
      router.push("/sales-orders");
      return;
    }
    const body = await res.json().catch(() => ({}));
    setError(body.error ?? "Failed to create sales order. Please try again.");
  };

  return (
    <div>
      <PageHeader title="Create Sales Order" description="Enter customer and line item details. Order will be submitted for manager approval." />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <SalesOrderForm customers={customers} items={items} onSubmit={handleSubmit} />
    </div>
  );
}
