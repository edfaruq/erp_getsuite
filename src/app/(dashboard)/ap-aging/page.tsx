"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface AgingRow {
  vendorName: string;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  total: number;
}

export default function APAgingPage() {
  const [rows, setRows] = useState<AgingRow[]>([]);
  const [summary, setSummary] = useState({ totalPayables: 0, vendorCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ptp/reports/aging")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.data?.rows ?? []);
        setSummary(d.data?.summary ?? { totalPayables: 0, vendorCount: 0 });
        setLoading(false);
      });
  }, []);

  const columns: Column<AgingRow>[] = [
    { key: "vendorName", header: "Vendor" },
    { key: "current", header: "Current", render: (r) => formatCurrency(r.current) },
    { key: "days30", header: "1–30 Days", render: (r) => formatCurrency(r.days30) },
    { key: "days60", header: "31–60 Days", render: (r) => formatCurrency(r.days60) },
    { key: "days90", header: "61+ Days", render: (r) => formatCurrency(r.days90) },
    { key: "total", header: "Total", render: (r) => formatCurrency(r.total) },
  ];

  return (
    <div>
      <PageHeader title="A/P Aging Report" description="Open payables grouped by vendor and aging bucket." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Payables</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{formatCurrency(summary.totalPayables)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Vendors with Balance</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{summary.vendorCount}</p></CardContent>
        </Card>
      </div>
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={rows} keyField="vendorName" />}
    </div>
  );
}
