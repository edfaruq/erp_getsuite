"use client";

import Link from "next/link";
import { PurchaseOrder } from "@/types/ptp.types";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  loading?: boolean;
}

export function PurchaseOrderTable({ orders, loading }: PurchaseOrderTableProps) {
  const columns: Column<PurchaseOrder>[] = [
    {
      key: "poNumber",
      header: "PO #",
      render: (row) => (
        <Link href={`/purchase-orders/${row.id}`} className="font-medium text-primary hover:underline">
          {row.poNumber}
        </Link>
      ),
    },
    { key: "vendorName", header: "Vendor" },
    { key: "date", header: "Date", render: (row) => formatDate(row.date) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "total",
      header: "Amount",
      render: (row) => formatCurrency(row.items?.reduce((s, i) => s + i.amount, 0) ?? 0, row.currency),
    },
  ];

  if (loading) return <div className="text-muted-foreground text-sm py-8 text-center">Loading purchase orders...</div>;
  return <DataTable columns={columns} data={orders} keyField="id" emptyMessage="No purchase orders found." />;
}
