"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryKpiPage() {
  const [kpi, setKpi] = useState({
    skuCount: 0, totalOnHand: 0, lowStockCount: 0,
    adjustmentsCount: 0, transfersCount: 0, ordersToPick: 0, posToReceive: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/reports/kpi")
      .then((r) => r.json())
      .then((d) => { setKpi(d.data ?? {}); setLoading(false); });
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const cards = [
    { label: "Inventory SKUs", value: kpi.skuCount },
    { label: "Total On Hand", value: kpi.totalOnHand },
    { label: "Low Stock Alerts", value: kpi.lowStockCount },
    { label: "Orders to Pick", value: kpi.ordersToPick },
    { label: "POs to Receive", value: kpi.posToReceive },
    { label: "Adjustments", value: kpi.adjustmentsCount },
    { label: "Transfers", value: kpi.transfersCount },
  ];

  return (
    <div>
      <PageHeader title="KPI & Reminders (Inventory)" description="Inventory operations metrics and queue depth." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{c.label}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{c.value}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
