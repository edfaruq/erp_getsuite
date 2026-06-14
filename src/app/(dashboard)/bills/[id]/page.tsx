"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ThreeWayMatch } from "@/components/ptp/ThreeWayMatch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRoleStore } from "@/store/role.store";

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const activeRole = useRoleStore((s) => s.activeRole);
  const [bill, setBill] = useState<Record<string, unknown> | null>(null);
  const [paying, setPaying] = useState(false);

  const fetchBill = useCallback(() => {
    fetch(`/api/ptp/bills/${id}`).then((r) => r.json()).then((d) => setBill(d.data));
  }, [id]);

  useEffect(() => { fetchBill(); }, [fetchBill]);

  const handlePay = async () => {
    if (!bill) return;
    setPaying(true);
    const res = await fetch("/api/ptp/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId: (bill.vendor as { id: string }).id ?? bill.vendorId,
        billId: id,
        amount: Number(bill.amount),
        apAccount: "Accounts Payable",
        account: "Checking",
        createdBy: activeRole,
      }),
    });
    if (res.ok) {
      fetchBill();
    }
    setPaying(false);
  };

  if (!bill) return <div className="text-muted-foreground">Loading...</div>;

  const status = String(bill.status);
  const po = bill.purchaseOrder as { id?: string; poNumber?: string; items?: { amount: unknown; quantity: number }[]; receipts?: { qtyReceived: number }[] } | null;
  const poAmount = po?.items?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const expectedQty = po?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const receiptQty = po?.receipts?.reduce((s, r) => s + r.qtyReceived, 0) ?? 0;

  return (
    <div>
      <PageHeader
        title={String(bill.billNumber)}
        description={`Vendor: ${(bill.vendor as { name: string })?.name}`}
        actions={
          <div className="flex items-center gap-2">
            {status === "APPROVED" && (
              <Button size="sm" onClick={handlePay} disabled={paying}>
                {paying ? "Processing..." : "Pay Bill"}
              </Button>
            )}
            <StatusBadge status={status} />
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-2 text-sm">
            <p><span className="text-muted-foreground">Date:</span> {formatDate(String(bill.date))}</p>
            <p><span className="text-muted-foreground">Due Date:</span> {formatDate(String(bill.dueDate))}</p>
            <p><span className="text-muted-foreground">Amount:</span> {formatCurrency(Number(bill.amount))}</p>
            <p><span className="text-muted-foreground">Memo:</span> {String(bill.memo ?? "—")}</p>
            {po?.id && (
              <p>
                <span className="text-muted-foreground">PO:</span>{" "}
                <Link href={`/purchase-orders/${po.id}`} className="text-primary hover:underline">{po.poNumber}</Link>
              </p>
            )}
          </CardContent>
        </Card>
        {po && (
          <ThreeWayMatch poAmount={poAmount} receiptQty={receiptQty} expectedQty={expectedQty} billAmount={Number(bill.amount)} />
        )}
      </div>
    </div>
  );
}
