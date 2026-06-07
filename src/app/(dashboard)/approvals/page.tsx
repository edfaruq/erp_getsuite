"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SalesOrderTable } from "@/components/otc/SalesOrderTable";
import { Button } from "@/components/ui/button";
import { useSalesOrders } from "@/hooks/otc/useSalesOrders";
import { useRoleStore } from "@/store/role.store";

export default function ApprovalsPage() {
  const activeRole = useRoleStore((s) => s.activeRole);
  const { orders, loading, refetch } = useSalesOrders("PENDING_APPROVAL");
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessing(id);
    await fetch(`/api/otc/sales-orders/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, approvedBy: activeRole }),
    });
    setProcessing(null);
    refetch();
  };

  return (
    <div>
      <PageHeader title="Sales Order Approvals" description="Review and approve or reject pending sales orders." />
      <SalesOrderTable orders={orders} loading={loading} />
      {orders.length > 0 && (
        <div className="mt-4 space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center gap-2 p-3 border rounded-lg">
              <span className="text-sm font-medium flex-1">{o.orderNumber} — {o.customerName}</span>
              <Button size="sm" onClick={() => handleAction(o.id, "approve")} disabled={processing === o.id}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => handleAction(o.id, "reject")} disabled={processing === o.id}>Reject</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
