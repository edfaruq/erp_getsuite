"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ItemTable } from "@/components/inventory/ItemTable";
import { Button } from "@/components/ui/button";
import { useItems } from "@/hooks/inventory/useItems";

export default function ItemsPage() {
  const { items, loading } = useItems();

  return (
    <div>
      <PageHeader
        title="Item Master"
        description="Manage inventory, non-inventory, and service items."
        actions={
          <Button asChild>
            <Link href="/items/new"><Plus className="h-4 w-4 mr-2" />New Item</Link>
          </Button>
        }
      />
      <ItemTable items={items} loading={loading} />
    </div>
  );
}
