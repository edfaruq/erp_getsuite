"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdjustForm } from "@/components/inventory/AdjustForm";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatDate } from "@/lib/utils";
import { useRoleStore } from "@/store/role.store";
import { useToastStore } from "@/store/toast.store";

interface Adjustment {
  id: string;
  itemName: string;
  adjustQty: number;
  newQty: number;
  memo?: string;
  date: string;
}

export default function AdjustPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const showToast = useToastStore((s) => s.showToast);
  const [items, setItems] = useState<{ id: string; displayName: string; stockQty: number }[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);

  const fetchData = () => {
    fetch("/api/inventory/items?itemType=INVENTORY").then((r) => r.json()).then((d) => setItems(d.data ?? []));
    fetch("/api/inventory/adjust").then((r) => r.json()).then((d) => setAdjustments(d.data ?? []));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: { itemId: string; adjustQty: number; memo?: string }) => {
    const res = await fetch("/api/inventory/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) {
      showToast("Inventory adjusted successfully!");
    } else {
      const json = await res.json();
      showToast(json.error ?? "Failed to adjust inventory", "error");
    }
    fetchData();
  };

  const columns: Column<Adjustment>[] = [
    { key: "itemName", header: "Item" },
    { key: "adjustQty", header: "Adjustment", render: (r) => (r.adjustQty > 0 ? `+${r.adjustQty}` : r.adjustQty) },
    { key: "newQty", header: "New Qty" },
    { key: "memo", header: "Memo" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
  ];

  return (
    <div>
      <PageHeader title="Adjust Inventory" description="Record inventory quantity adjustments." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdjustForm items={items} onSubmit={handleSubmit} />
        <div>
          <h3 className="font-medium mb-3">Recent Adjustments</h3>
          <DataTable columns={columns} data={adjustments} keyField="id" emptyMessage="No adjustments yet." />
        </div>
      </div>
    </div>
  );
}
