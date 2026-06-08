"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SalesOrder } from "@/types/otc.types";

interface OrderLineItem {
  itemName?: string;
  item?: { displayName: string };
  quantity: number;
  rate: number;
  amount: number;
}

interface OrderDetail extends Omit<SalesOrder, "items"> {
  customer?: { name: string };
  items?: OrderLineItem[];
}

export default function SalesOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrder = useCallback(() => {
    fetch(`/api/otc/sales-orders/${id}`).then((r) => r.json()).then((d) => setOrder(d.data));
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleSubmitForApproval = async () => {
    setSubmitting(true);
    const res = await fetch(`/api/otc/sales-orders/${id}/submit`, { method: "POST" });
    setSubmitting(false);
    if (res.ok) {
      fetchOrder();
      router.refresh();
    }
  };

  if (!order) return <div className="text-muted-foreground">Loading...</div>;

  const items = order.items ?? [];

  return (
    <div>
      <PageHeader
        title={order.orderNumber}
        description={`Customer: ${order.customerName ?? order.customer?.name}`}
        actions={
          <div className="flex items-center gap-2">
            {order.status === "DRAFT" && (
              <Button size="sm" onClick={handleSubmitForApproval} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            )}
            <StatusBadge status={order.status} />
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Date:</span> {formatDate(order.date)}</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Location:</span> {order.location}</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm"><span className="text-muted-foreground">Memo:</span> {order.memo ?? "—"}</CardContent></Card>
      </div>
      <Card>
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Rate</th><th className="text-right py-2">Amount</th></tr></thead>
            <tbody>
              {items.map((line, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{line.itemName ?? line.item?.displayName}</td>
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
