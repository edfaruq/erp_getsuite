"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils";

interface Row { itemName: string; quantity: number; revenue: number }

export default function SalesByItemsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/reports/sales-by-items")
      .then((r) => r.json())
      .then((d) => { setRows(d.data ?? []); setLoading(false); });
  }, []);

  const columns: Column<Row>[] = [
    { key: "itemName", header: "Item" },
    { key: "quantity", header: "Qty Sold" },
    { key: "revenue", header: "Revenue", render: (r) => formatCurrency(r.revenue) },
  ];

  return (
    <div>
      <PageHeader title="Sales by Item" description="Sales volume and revenue aggregated by item." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={rows} keyField="itemName" />}
    </div>
  );
}
