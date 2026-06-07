"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/ptp/purchase-orders/${id}`).then((r) => r.json()).then((d) => setOrder(d.data));
  }, [id]);

  if (!order) return <div className="text-muted-foreground">Loading...</div>;

  const items = (order.items as { item: { displayName: string }; quantity: number; rate: unknown; amount: unknown }[]) ?? [];

  return (
    <div>
      <PageHeader
        title={String(order.poNumber)}
        description={`Vendor: ${(order.vendor as { name: string })?.name}`}
        actions={<StatusBadge status={String(order.status)} />}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Date:</span> {formatDate(String(order.date))}</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Location:</span> {String(order.location)}</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Memo:</span> {String(order.memo ?? "—")}</CardContent></Card>
      </div>
      <Card>
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Rate</th><th className="text-right py-2">Amount</th></tr></thead>
            <tbody>
              {items.map((line, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{line.item.displayName}</td>
                  <td className="text-right py-2">{line.quantity}</td>
                  <td className="text-right py-2">{formatCurrency(Number(line.rate))}</td>
                  <td className="text-right py-2">{formatCurrency(Number(line.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
