"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleStore } from "@/store/role.store";

interface Receipt {
  itemId: string;
  qtyReceived: number;
}

interface POLine {
  itemId: string;
  item: { displayName: string };
  quantity: number;
}

export default function ReceivePage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [qtyInputs, setQtyInputs] = useState<Record<string, number>>({});

  const fetchOrders = () => {
    fetch("/api/ptp/receive").then((r) => r.json()).then((d) => { setOrders(d.data ?? []); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  const getReceivedQty = (receipts: Receipt[], itemId: string) =>
    receipts.filter((r) => r.itemId === itemId).reduce((s, r) => s + r.qtyReceived, 0);

  const handleReceive = async (poId: string, itemId: string, qty: number) => {
    if (qty <= 0) return;
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
            const items = (po.items as POLine[]) ?? [];
            const receipts = (po.receipts as Receipt[]) ?? [];
            return (
              <Card key={String(po.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{String(po.poNumber)} — {(po.vendor as { name: string })?.name}</CardTitle>
                    <StatusBadge status={String(po.status)} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((line) => {
                    const received = getReceivedQty(receipts, line.itemId);
                    const remaining = line.quantity - received;
                    const inputKey = `${po.id}-${line.itemId}`;
                    return (
                      <div key={line.itemId} className="flex items-center justify-between gap-4 text-sm border-t pt-3">
                        <div>
                          <p className="font-medium">{line.item.displayName}</p>
                          <p className="text-muted-foreground">
                            Ordered: {line.quantity} · Received: {received} · Remaining: {remaining}
                          </p>
                        </div>
                        {remaining > 0 ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              max={remaining}
                              className="w-20 h-8"
                              value={qtyInputs[inputKey] ?? remaining}
                              onChange={(e) => setQtyInputs((prev) => ({ ...prev, [inputKey]: Number(e.target.value) }))}
                            />
                            <Button size="sm" onClick={() => handleReceive(String(po.id), line.itemId, qtyInputs[inputKey] ?? remaining)}>
                              Receive
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-emerald-600">Fully received</span>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
