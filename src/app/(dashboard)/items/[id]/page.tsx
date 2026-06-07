"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Item } from "@/types/inventory.types";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    fetch(`/api/inventory/items/${id}`).then((r) => r.json()).then((d) => setItem(d.data));
  }, [id]);

  if (!item) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title={item.displayName} description={item.name} actions={<Badge variant="outline">{item.itemType.replace("_", " ")}</Badge>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "On Hand", value: item.stockQty },
          { label: "Unit", value: item.unitType },
          { label: "Costing", value: item.costingMethod },
          { label: "Tax Schedule", value: item.taxSchedule.replace("_", " ") },
          { label: "Department", value: item.department ?? "—" },
          { label: "Class", value: item.class ?? "—" },
        ].map((field) => (
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
