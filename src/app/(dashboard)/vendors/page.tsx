"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";

interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  poCount: number;
  billCount: number;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ptp/vendors").then((r) => r.json()).then((d) => { setVendors(d.data ?? []); setLoading(false); });
  }, []);

  const columns: Column<Vendor>[] = [
    { key: "name", header: "Vendor", render: (r) => <Link href={`/vendors/${r.id}`} className="text-primary hover:underline">{r.name}</Link> },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "poCount", header: "POs" },
    { key: "billCount", header: "Bills" },
  ];

  return (
    <div>
      <PageHeader
        title="Vendor Master"
        description="Manage vendor records and purchasing relationships."
        actions={<Button asChild><Link href="/vendors/new"><Plus className="h-4 w-4 mr-2" />New Vendor</Link></Button>}
      />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={vendors} keyField="id" />}
    </div>
  );
}
