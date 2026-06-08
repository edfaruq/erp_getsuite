"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

interface LineItem {
  quantity: number;
  item: { displayName: string; name: string; stockQty: number; itemType: string };
}

interface FulfillmentOrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    customer?: { name: string };
    date: string | Date;
    status: string;
    items?: LineItem[];
  };
  actionLabel: string;
  onAction: (orderId: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function FulfillmentOrderCard({
  order,
  actionLabel,
  onAction,
  loading,
  error,
}: FulfillmentOrderCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{order.orderNumber}</CardTitle>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p>Customer: {order.customer?.name}</p>
          <p>Date: {formatDate(order.date)}</p>
        </div>
        {order.items && order.items.length > 0 && (
          <div className="border rounded-md divide-y text-sm">
            {order.items.map((line, idx) => (
              <div key={idx} className="px-3 py-2 flex justify-between gap-2">
                <span className="truncate">{line.item.displayName}</span>
                <span className="shrink-0 text-muted-foreground">
                  Qty {line.quantity}
                  {line.item.itemType === "INVENTORY" && (
                    <span className={line.item.stockQty < line.quantity ? " text-destructive ml-1" : " ml-1"}>
                      (stock: {line.item.stockQty})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button size="sm" onClick={() => onAction(order.id)} disabled={loading}>
          {loading ? "Processing..." : actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
