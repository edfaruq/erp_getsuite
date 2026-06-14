"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRoleStore } from "@/store/role.store";

interface POLine {
  item: { displayName: string };
  quantity: number;
  rate: unknown;
  amount: unknown;
}

export default function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const activeRole = useRoleStore((s) => s.activeRole);
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(() => {
    fetch(`/api/ptp/purchase-orders/${id}`).then((r) => r.json()).then((d) => setOrder(d.data));
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleSubmitForReceipt = async () => {
    setActionLoading(true);
    setError(null);
    const res = await fetch(`/api/ptp/purchase-orders/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvedBy: activeRole }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to submit PO");
    } else {
      fetchOrder();
    }
    setActionLoading(false);
  };

  const handleCreateBill = async () => {
    if (!order) return;
    setActionLoading(true);
    setError(null);
    const items = (order.items as POLine[]) ?? [];
    const amount = items.reduce((s, i) => s + Number(i.amount), 0);
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
    const res = await fetch("/api/ptp/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId: (order.vendor as { id: string }).id ?? order.vendorId,
        purchaseOrderId: id,
        dueDate,
        amount,
        memo: `Bill for ${order.poNumber}`,
        createdBy: activeRole,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create bill");
      setActionLoading(false);
      return;
    }
    const data = await res.json();
    router.push(`/bills/${data.data.id}`);
  };

  if (!order) return <div className="text-muted-foreground">Loading...</div>;

  const items = (order.items as POLine[]) ?? [];
  const status = String(order.status);
  const total = items.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div>
      <PageHeader
        title={String(order.poNumber)}
        description={`Vendor: ${(order.vendor as { name: string })?.name}`}
        actions={
          <div className="flex items-center gap-2">
            {status === "DRAFT" && (
              <Button size="sm" onClick={handleSubmitForReceipt} disabled={actionLoading}>
                Submit for Receipt
              </Button>
            )}
            {status === "RECEIVED" && (
              <Button size="sm" onClick={handleCreateBill} disabled={actionLoading}>
                Create Bill
              </Button>
            )}
            <StatusBadge status={status} />
          </div>
        }
      />
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Date:</span> {formatDate(String(order.date))}</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Location:</span> {String(order.location)}</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Total:</span> {formatCurrency(total)}</CardContent></Card>
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
