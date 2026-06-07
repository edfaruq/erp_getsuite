"use client";

import Link from "next/link";
import { SalesOrder } from "@/types/otc.types";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface SalesOrderTableProps {
  orders: SalesOrder[];
  loading?: boolean;
}

export function SalesOrderTable({ orders, loading }: SalesOrderTableProps) {
  const columns: Column<SalesOrder>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (row) => (
        <Link href={`/sales-orders/${row.id}`} className="font-medium text-primary hover:underline">
          {row.orderNumber}
        </Link>
      ),
    },
    { key: "customerName", header: "Customer" },
    { key: "date", header: "Date", render: (row) => formatDate(row.date) },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "total",
      header: "Amount",
      render: (row) => {
        const total = row.items?.reduce((s, i) => s + i.amount, 0) ?? 0;
        return formatCurrency(total, row.currency);
      },
    },
  ];

  if (loading) return <div className="text-muted-foreground text-sm py-8 text-center">Loading sales orders...</div>;

  return <DataTable columns={columns} data={orders} keyField="id" emptyMessage="No sales orders found." />;
}
