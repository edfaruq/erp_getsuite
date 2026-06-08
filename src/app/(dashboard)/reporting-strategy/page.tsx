"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function ReportingStrategyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/inventory/strategy?type=reporting")
      .then((r) => r.json())
      .then((d) => { setContent(d.data?.content ?? ""); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/inventory/strategy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reporting", content }),
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div>
      <PageHeader
        title="Define Reporting Strategy"
        description="CEO/CFO reporting cadence and KPI definitions across OTC, PTP, and inventory."
      />
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="max-w-3xl space-y-4">
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
          />
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Strategy"}
            </Button>
            {saved && <span className="text-sm text-muted-foreground">Saved successfully.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
