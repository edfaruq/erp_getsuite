"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface AgingRow {
  customerName: string;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  total: number;
}

export default function ARAgingPage() {
  const [rows, setRows] = useState<AgingRow[]>([]);
  const [summary, setSummary] = useState({ totalReceivables: 0, customerCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/otc/reports/aging")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.data?.rows ?? []);
        setSummary(d.data?.summary ?? { totalReceivables: 0, customerCount: 0 });
        setLoading(false);
      });
  }, []);

  const columns: Column<AgingRow>[] = [
    { key: "customerName", header: "Customer" },
    { key: "current", header: "Current", render: (r) => formatCurrency(r.current) },
    { key: "days30", header: "1–30 Days", render: (r) => formatCurrency(r.days30) },
    { key: "days60", header: "31–60 Days", render: (r) => formatCurrency(r.days60) },
    { key: "days90", header: "61+ Days", render: (r) => formatCurrency(r.days90) },
    { key: "total", header: "Total", render: (r) => formatCurrency(r.total) },
  ];

  return (
    <div>
      <PageHeader title="A/R Aging Report" description="Open receivables grouped by customer and aging bucket." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Receivables</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{formatCurrency(summary.totalReceivables)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Customers with Balance</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{summary.customerCount}</p></CardContent>
        </Card>
      </div>
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={rows} keyField="customerName" />}
    </div>
  );
}
