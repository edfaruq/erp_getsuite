"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { VendorBill } from "@/types/ptp.types";

export default function BillsPage() {
  const [bills, setBills] = useState<VendorBill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ptp/bills").then((r) => r.json()).then((d) => { setBills(d.data ?? []); setLoading(false); });
  }, []);

  const columns: Column<VendorBill>[] = [
    { key: "billNumber", header: "Bill #", render: (r) => <Link href={`/bills/${r.id}`} className="text-primary hover:underline">{r.billNumber}</Link> },
    { key: "vendorName", header: "Vendor" },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "dueDate", header: "Due", render: (r) => formatDate(r.dueDate) },
    { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Vendor Bills"
        description="Manage vendor bills and 3-way matching."
        actions={<Button asChild><Link href="/bills/new"><Plus className="h-4 w-4 mr-2" />New Bill</Link></Button>}
      />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={bills} keyField="id" />}
    </div>
  );
}
