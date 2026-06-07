"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function PTPKpiPage() {
  const [kpi, setKpi] = useState({ totalPayables: 0, avgDaysToPay: 0, activeVendors: 0, billsToPayCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ptp/reports/kpi")
      .then((r) => r.json())
      .then((d) => { setKpi(d.data ?? {}); setLoading(false); });
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <PageHeader title="KPI & Scorecard (A/P)" description="Accounts payable performance metrics." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Payables</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{formatCurrency(kpi.totalPayables)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg Days to Pay</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{kpi.avgDaysToPay}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Vendors</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{kpi.activeVendors}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Bills to Pay</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{kpi.billsToPayCount}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
