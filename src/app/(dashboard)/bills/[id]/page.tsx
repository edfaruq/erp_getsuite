"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ThreeWayMatch } from "@/components/ptp/ThreeWayMatch";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [bill, setBill] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/ptp/bills/${id}`).then((r) => r.json()).then((d) => setBill(d.data));
  }, [id]);

  if (!bill) return <div className="text-muted-foreground">Loading...</div>;

  const po = bill.purchaseOrder as { items?: { amount: unknown; quantity: number }[]; receipts?: { qtyReceived: number }[] } | null;
  const poAmount = po?.items?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const expectedQty = po?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const receiptQty = po?.receipts?.reduce((s, r) => s + r.qtyReceived, 0) ?? 0;

  return (
    <div>
      <PageHeader
        title={String(bill.billNumber)}
        description={`Vendor: ${(bill.vendor as { name: string })?.name}`}
        actions={<StatusBadge status={String(bill.status)} />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-2 text-sm">
            <p><span className="text-muted-foreground">Date:</span> {formatDate(String(bill.date))}</p>
            <p><span className="text-muted-foreground">Due Date:</span> {formatDate(String(bill.dueDate))}</p>
            <p><span className="text-muted-foreground">Amount:</span> {formatCurrency(Number(bill.amount))}</p>
            <p><span className="text-muted-foreground">Memo:</span> {String(bill.memo ?? "—")}</p>
          </CardContent>
        </Card>
        {po && (
          <ThreeWayMatch poAmount={poAmount} receiptQty={receiptQty} expectedQty={expectedQty} billAmount={Number(bill.amount)} />
        )}
      </div>
    </div>
  );
}
