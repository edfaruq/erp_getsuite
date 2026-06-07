"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";

interface WorksheetRow {
  itemNumber: string;
  displayName: string;
  location: string;
  unitType: string;
  onHand: number;
  counted: number;
  variance: number;
}

export default function PhysicalWorksheetPage() {
  const [rows, setRows] = useState<WorksheetRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/reports/worksheet")
      .then((r) => r.json())
      .then((d) => { setRows(d.data ?? []); setLoading(false); });
  }, []);

  const columns: Column<WorksheetRow>[] = [
    { key: "itemNumber", header: "Item #" },
    { key: "displayName", header: "Display Name" },
    { key: "location", header: "Location" },
    { key: "unitType", header: "Unit" },
    { key: "onHand", header: "On Hand" },
    { key: "counted", header: "Counted" },
    { key: "variance", header: "Variance" },
  ];

  return (
    <div>
      <PageHeader title="Physical Inventory Worksheet" description="Count sheet for cycle counts and physical inventory." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : <DataTable columns={columns} data={rows} keyField="itemNumber" />}
    </div>
  );
}
