"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  _count?: { stocks: number };
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchWarehouses = () => {
    fetch("/api/inventory/warehouses")
      .then((r) => r.json())
      .then((d) => { setWarehouses(d.data ?? []); setLoading(false); });
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/inventory/warehouses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code }),
    });
    setName("");
    setCode("");
    setSaving(false);
    fetchWarehouses();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/inventory/warehouses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchWarehouses();
  };

  const columns: Column<Warehouse>[] = [
    { key: "code", header: "Code" },
    { key: "name", header: "Name" },
    {
      key: "isActive",
      header: "Status",
      render: (r) => (
        <Badge variant={r.isActive ? "default" : "secondary"}>
          {r.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "_count",
      header: "Stock Records",
      render: (r) => r._count?.stocks ?? 0,
    },
    {
      key: "id",
      header: "Actions",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => toggleActive(r.id, r.isActive)}>
          {r.isActive ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Warehouses"
        description="Define warehouse locations for inventory tracking and transfers."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleCreate} className="space-y-4 max-w-md border rounded-lg p-6">
          <h3 className="font-medium">Add Warehouse</h3>
          <div className="space-y-2">
            <Label>Warehouse Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="East Distribution Center" required />
          </div>
          <div className="space-y-2">
            <Label>Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="EDC" required />
          </div>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Warehouse"}</Button>
        </form>
        <div>
          <h3 className="font-medium mb-3">Warehouses</h3>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <DataTable columns={columns} data={warehouses} keyField="id" emptyMessage="No warehouses yet." />
          )}
        </div>
      </div>
    </div>
  );
}
