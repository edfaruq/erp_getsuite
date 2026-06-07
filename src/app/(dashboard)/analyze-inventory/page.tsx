"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyzeData {
  summary: {
    totalItems: number;
    inventoryCount: number;
    nonInventoryCount: number;
    serviceCount: number;
    totalOnHand: number;
    lowStockCount: number;
    zeroStockCount: number;
  };
  lowStock: { name: string; stockQty: number }[];
  topOnHand: { name: string; stockQty: number }[];
}

export default function AnalyzeInventoryPage() {
  const [data, setData] = useState<AnalyzeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/reports/analyze")
      .then((r) => r.json())
      .then((d) => { setData(d.data ?? null); setLoading(false); });
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!data) return <p className="text-muted-foreground">No data.</p>;

  const s = data.summary;

  return (
    <div>
      <PageHeader title="Analyze Inventory" description="Full inventory analysis — composition, stock health, and top movers." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Items", value: s.totalItems },
          { label: "On Hand Units", value: s.totalOnHand },
          { label: "Low Stock", value: s.lowStockCount },
          { label: "Zero Stock", value: s.zeroStockCount },
        ].map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{c.label}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{c.value}</p></CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Low Stock Items</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.lowStock.length === 0 ? <p className="text-sm text-muted-foreground">None</p> : data.lowStock.map((i) => (
              <div key={i.name} className="flex justify-between text-sm border-b pb-2">
                <span>{i.name}</span><span className="text-amber-700">{i.stockQty} on hand</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Top On-Hand</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.topOnHand.map((i) => (
              <div key={i.name} className="flex justify-between text-sm border-b pb-2">
                <span>{i.name}</span><span>{i.stockQty}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
