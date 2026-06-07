"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SalesOrderForm } from "@/components/otc/SalesOrderForm";
import { useRoleStore } from "@/store/role.store";

export default function NewSalesOrderPage() {
  const router = useRouter();
  const activeRole = useRoleStore((s) => s.activeRole);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [items, setItems] = useState<{ id: string; displayName: string }[]>([]);

  useEffect(() => {
    fetch("/api/inventory/items").then((r) => r.json()).then((d) => setItems(d.data ?? []));
    // Customers from seed - in production would have dedicated API
    setCustomers([
      { id: "cust-zenith", name: "10 Zenith Systems" },
      { id: "cust-bain", name: "18 Bain Consulting" },
      { id: "cust-acme", name: "Acme Corporation" },
      { id: "cust-globex", name: "Globex International" },
      { id: "cust-initech", name: "Initech Solutions" },
    ]);
  }, []);

  const handleSubmit = async (data: { customerId: string; location?: string; memo?: string; items: { itemId: string; rate: number; quantity: number; amount: number }[] }) => {
    const res = await fetch("/api/otc/sales-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) router.push("/sales-orders");
  };

  return (
    <div>
      <PageHeader title="Create Sales Order" description="Enter customer and line item details." />
      <SalesOrderForm customers={customers} items={items} onSubmit={handleSubmit} />
    </div>
  );
}
