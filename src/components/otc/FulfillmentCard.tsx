"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

interface FulfillmentCardProps {
  order: {
    id: string;
    orderNumber: string;
    customer?: { name: string };
    customerName?: string;
    date: string | Date;
    status: string;
  };
  actionLabel: string;
  onAction: (orderId: string) => Promise<void>;
  loading?: boolean;
}

export function FulfillmentCard({ order, actionLabel, onAction, loading }: FulfillmentCardProps) {
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
          <p>Customer: {order.customer?.name ?? order.customerName}</p>
          <p>Date: {formatDate(order.date)}</p>
        </div>
        <Button size="sm" onClick={() => onAction(order.id)} disabled={loading}>
          {loading ? "Processing..." : actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
