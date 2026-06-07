"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils";

interface Row { itemName: string; quantity: number; spend: number }

export default function PurchaseByItemsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/reports/purchase-by-items")
      .then((r) => r.json())
      .then((d) => { setRows(d.data ?? []); setLoading(false); });
  }, []);

  const columns: Column<Row>[] = [
    { key: "itemName", header: "Item" },
    { key: "quantity", header: "Qty Purchased" },
    { key: "spend", header: "Spend", render: (r) => formatCurrency(r.spend) },
  ];

  return (
    <div>
      <PageHeader title="Purchase by Items" description="Purchase volume and spend aggregated by item." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={rows} keyField="itemName" />}
    </div>
  );
}
