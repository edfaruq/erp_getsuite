"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { TransferForm } from "@/components/inventory/TransferForm";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatDate } from "@/lib/utils";
import { useRoleStore } from "@/store/role.store";

interface Transfer {
  id: string;
  itemName: string;
  fromLocation: string;
  toLocation: string;
  qty: number;
  memo?: string;
  date: string;
}

export default function TransferPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const [items, setItems] = useState<{ id: string; displayName: string; stockQty: number }[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const fetchData = () => {
    fetch("/api/inventory/items").then((r) => r.json()).then((d) => setItems(d.data ?? []));
    fetch("/api/inventory/transfer").then((r) => r.json()).then((d) => setTransfers(d.data ?? []));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: { itemId: string; fromLocation: string; toLocation: string; qty: number; memo?: string }) => {
    await fetch("/api/inventory/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    fetchData();
  };

  const columns: Column<Transfer>[] = [
    { key: "itemName", header: "Item" },
    { key: "fromLocation", header: "From" },
    { key: "toLocation", header: "To" },
    { key: "qty", header: "Qty" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
  ];

  return (
    <div>
      <PageHeader title="Transfer Inventory" description="Transfer items between warehouse locations." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransferForm items={items} onSubmit={handleSubmit} />
        <div>
          <h3 className="font-medium mb-3">Recent Transfers</h3>
          <DataTable columns={columns} data={transfers} keyField="id" emptyMessage="No transfers yet." />
        </div>
      </div>
    </div>
  );
}
