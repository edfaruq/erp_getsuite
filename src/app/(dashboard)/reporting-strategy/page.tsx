"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportingStrategyPage() {
  return (
    <div>
      <PageHeader title="Define Reporting Strategy" description="CEO/CFO reporting cadence and KPI definitions across OTC, PTP, and inventory." />
      <Card>
        <CardHeader><CardTitle className="text-base">Reporting Strategy</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Executive dashboards consolidate operational KPIs with financial aging and item-level performance trends.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Weekly: inventory on-hand, low-stock alerts, fulfillment queue depth</li>
            <li>Monthly: sales-by-item and purchase-by-item variance vs plan</li>
            <li>Monthly: A/R and A/P aging with DSO/DPO targets</li>
            <li>Quarterly: item strategy review and catalog rationalization</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
