"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function OTCKpiPage() {
  const [kpi, setKpi] = useState({ totalReceivables: 0, avgDaysToReceive: 0, newCustomers: 0, openInvoiceCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/otc/reports/kpi")
      .then((r) => r.json())
      .then((d) => { setKpi(d.data ?? {}); setLoading(false); });
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <PageHeader title="KPI & Scorecard (A/R)" description="Accounts receivable performance metrics." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Receivables</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{formatCurrency(kpi.totalReceivables)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg Days to Receive</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{kpi.avgDaysToReceive}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Customers</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{kpi.newCustomers}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Open Invoices</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{kpi.openInvoiceCount}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
