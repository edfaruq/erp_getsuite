"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleStore } from "@/store/role.store";

export default function ReceivePage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch("/api/ptp/receive").then((r) => r.json()).then((d) => { setOrders(d.data ?? []); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleReceive = async (poId: string, itemId: string, qty: number) => {
    await fetch("/api/ptp/receive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseOrderId: poId, itemId, qtyReceived: qty, createdBy: activeRole }),
    });
    fetchOrders();
  };

  return (
    <div>
      <PageHeader title="Receive Purchase Orders" description="Receive items against open purchase orders." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-4">
          {orders.length === 0 ? <p className="text-muted-foreground">No POs pending receipt.</p> : orders.map((po) => {
            const items = (po.items as { itemId: string; item: { displayName: string }; quantity: number }[]) ?? [];
            return (
              <Card key={String(po.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{String(po.poNumber)} — {(po.vendor as { name: string })?.name}</CardTitle>
                    <StatusBadge status={String(po.status)} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((line) => (
                    <div key={line.itemId} className="flex items-center justify-between text-sm border-t pt-2">
                      <span>{line.item.displayName} (Qty: {line.quantity})</span>
                      <Button size="sm" onClick={() => handleReceive(String(po.id), line.itemId, line.quantity)}>Receive All</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
