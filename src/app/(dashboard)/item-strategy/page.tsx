"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ItemStrategyPage() {
  return (
    <div>
      <PageHeader title="Define Item Strategy" description="CEO/CFO strategic guidelines for item catalog and classification." />
      <Card>
        <CardHeader><CardTitle className="text-base">Item Strategy Framework</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Focus inventory investment on high-velocity SKUs with strong margin contribution. Limit long-tail non-inventory purchases to approved vendor catalogs.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Maintain minimum 30 days cover on A-class inventory items</li>
            <li>Review slow-moving stock monthly and trigger transfer or adjustment workflows</li>
            <li>Standardize service items for recurring revenue bundles</li>
            <li>Align item classes with departmental P&amp;L reporting structure</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
