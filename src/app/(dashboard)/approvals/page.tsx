"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SalesOrderTable } from "@/components/otc/SalesOrderTable";
import { Button } from "@/components/ui/button";
import { useSalesOrders } from "@/hooks/otc/useSalesOrders";
import { useRoleStore } from "@/store/role.store";
import { SalesOrder } from "@/types/otc.types";

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

  const renderActions = (order: SalesOrder) => (
    <>
      <Button size="sm" onClick={() => handleAction(order.id, "approve")} disabled={processing === order.id}>
        Approve
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleAction(order.id, "reject")} disabled={processing === order.id}>
        Reject
      </Button>
    </>
  );

  return (
    <div>
      <PageHeader title="Sales Order Approvals" description="Review and approve or reject pending sales orders." />
      <SalesOrderTable orders={orders} loading={loading} renderActions={renderActions} />
    </div>
  );
}
