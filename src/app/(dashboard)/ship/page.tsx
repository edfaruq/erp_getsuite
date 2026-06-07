"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FulfillmentCard } from "@/components/otc/FulfillmentCard";
import { useRoleStore } from "@/store/role.store";

export default function ShipPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchOrders = () => {
    fetch("/api/otc/fulfillment/ship").then((r) => r.json()).then((d) => { setOrders(d.data ?? []); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleShip = async (orderId: string) => {
    setProcessing(orderId);
    await fetch("/api/otc/fulfillment/ship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesOrderId: orderId, createdBy: activeRole }),
    });
    setProcessing(null);
    fetchOrders();
  };

  return (
    <div>
      <PageHeader title="Ship Orders" description="Ship packed orders to customers." />
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.length === 0 ? <p className="text-muted-foreground col-span-full">No orders to ship.</p> : orders.map((o) => (
            <FulfillmentCard
              key={String(o.id)}
              order={o as { id: string; orderNumber: string; customer?: { name: string }; date: string; status: string }}
              actionLabel="Ship Order"
              onAction={handleShip}
              loading={processing === String(o.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
