"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, ArrowRightLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Item } from "@/types/inventory.types";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<(Item & { warehouseName?: string }) | null>(null);
  const [converting, setConverting] = useState(false);

  const loadItem = () => {
    fetch(`/api/inventory/items/${id}`).then((r) => r.json()).then((d) => setItem(d.data));
  };

  useEffect(() => { loadItem(); }, [id]);

  const handleConvert = async () => {
    if (!confirm("Convert this item to Inventory? Stock tracking will be enabled.")) return;
    setConverting(true);
    const res = await fetch(`/api/inventory/items/${id}/convert-to-inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQty: 0, reorderPoint: 5 }),
    });
    setConverting(false);
    if (res.ok) router.push(`/items/${id}/edit`);
    else loadItem();
  };

  if (!item) return <div className="text-muted-foreground">Loading...</div>;

  const fields = [
    { label: "Type", value: item.itemType.replace("_", " ") },
    { label: "On Hand", value: item.itemType === "INVENTORY" ? item.stockQty : "—" },
    { label: "Reorder Point", value: item.itemType === "INVENTORY" ? (item.reorderPoint ?? 5) : "—" },
    { label: "Warehouse", value: item.warehouseName ?? item.location ?? "—" },
    { label: "Vendor", value: item.vendorName ?? "—" },
    { label: "Unit", value: item.unitType },
    { label: "Stock Unit", value: item.primaryStockUnit ?? "—" },
    { label: "Purchase Unit", value: item.primaryPurchaseUnit ?? "—" },
    { label: "Sale Unit", value: item.primarySaleUnit ?? "—" },
    { label: "Costing", value: item.costingMethod },
    { label: "Tax Schedule", value: item.taxSchedule.replace("_", " ") },
    { label: "Department", value: item.department ?? "—" },
    { label: "Class", value: item.class ?? "—" },
    { label: "COGS Account", value: item.cogsAccount ?? "—" },
    { label: "Asset Account", value: item.assetAccount ?? "—" },
    { label: "Income Account", value: item.incomeAccount ?? "—" },
    { label: "Expense Account", value: item.expenseAccount ?? "—" },
  ];

  return (
    <div>
      <PageHeader
        title={item.displayName}
        description={item.name}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">{item.itemType.replace("_", " ")}</Badge>
            {item.itemType === "NON_INVENTORY" && (
              <Button size="sm" variant="secondary" onClick={handleConvert} disabled={converting}>
                <ArrowRightLeft className="h-4 w-4 mr-1" />
                {converting ? "Converting..." : "Convert to Inventory"}
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <Link href={`/items/${id}/edit`}><Pencil className="h-4 w-4 mr-1" />Edit</Link>
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <Card key={field.label}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{field.label}</p>
              <p className="font-medium mt-1">{field.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
