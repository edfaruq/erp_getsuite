"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoleStore } from "@/store/role.store";
import { Badge } from "@/components/ui/badge";

interface WorksheetRow {
  id: string;
  itemId: string;
  itemNumber: string;
  displayName: string;
  location: string;
  unitType: string;
  onHand: number;
  counted: number;
  variance: number;
}

export default function PhysicalWorksheetPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [rows, setRows] = useState<WorksheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchWorksheet = () => {
    setLoading(true);
    fetch("/api/inventory/reports/worksheet")
      .then((r) => r.json())
      .then((d) => {
        setSessionId(d.sessionId ?? "");
        setStatus(d.status ?? "DRAFT");
        setRows(d.data ?? []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchWorksheet(); }, []);

  const updateCounted = (itemId: string, counted: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.itemId === itemId
          ? { ...r, counted, variance: counted - r.onHand }
          : r
      )
    );
  };

  const save = async (submit: boolean) => {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/inventory/reports/worksheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        submit,
        createdBy: activeRole,
        lines: rows.map((r) => ({ itemId: r.itemId, counted: r.counted })),
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(json.error ?? "Failed to save");
      return;
    }
    setMessage(submit ? "Worksheet submitted. Variances applied as adjustments." : "Counts saved.");
    setSessionId(json.sessionId ?? sessionId);
    setStatus(json.status ?? status);
    setRows(json.data ?? rows);
  };

  const varianceCount = rows.filter((r) => r.variance !== 0).length;

  return (
    <div>
      <PageHeader
        title="Physical Inventory Worksheet"
        description="Enter counted quantities, review variances, and submit to post adjustments."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">{status}</Badge>
            {varianceCount > 0 && <Badge variant="destructive">{varianceCount} variances</Badge>}
          </div>
        }
      />
      {message && <p className="text-sm text-muted-foreground mb-4">{message}</p>}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Item #</th>
                  <th className="text-left p-3">Display Name</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-right p-3">On Hand</th>
                  <th className="text-right p-3">Counted</th>
                  <th className="text-right p-3">Variance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.itemId} className="border-t">
                    <td className="p-3">{row.itemNumber}</td>
                    <td className="p-3">{row.displayName}</td>
                    <td className="p-3 text-muted-foreground">{row.location}</td>
                    <td className="p-3 text-right">{row.onHand}</td>
                    <td className="p-3 text-right">
                      <Input
                        type="number"
                        min={0}
                        className="w-24 ml-auto"
                        value={row.counted}
                        disabled={status !== "DRAFT"}
                        onChange={(e) => updateCounted(row.itemId, Number(e.target.value))}
                      />
                    </td>
                    <td className={`p-3 text-right font-medium ${row.variance !== 0 ? "text-destructive" : ""}`}>
                      {row.variance > 0 ? `+${row.variance}` : row.variance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {status === "DRAFT" && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => save(false)} disabled={saving}>
                Save Counts
              </Button>
              <Button onClick={() => save(true)} disabled={saving}>
                {saving ? "Submitting..." : "Submit & Apply Variances"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
