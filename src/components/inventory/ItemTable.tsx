"use client";

import Link from "next/link";
import { Item } from "@/types/inventory.types";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";

interface ItemTableProps {
  items: Item[];
  loading?: boolean;
}

export function ItemTable({ items, loading }: ItemTableProps) {
  const columns: Column<Item>[] = [
    {
      key: "name",
      header: "Item #",
      render: (row) => (
        <Link href={`/items/${row.id}`} className="font-medium text-primary hover:underline">
          {row.name}
        </Link>
      ),
    },
    { key: "displayName", header: "Display Name" },
    {
      key: "itemType",
      header: "Type",
      render: (row) => <Badge variant="outline">{row.itemType.replace("_", " ")}</Badge>,
    },
    { key: "stockQty", header: "On Hand" },
    { key: "unitType", header: "Unit" },
    { key: "department", header: "Department" },
  ];

  if (loading) return <div className="text-muted-foreground text-sm py-8 text-center">Loading items...</div>;
  return <DataTable columns={columns} data={items} keyField="id" emptyMessage="No items found." />;
}
