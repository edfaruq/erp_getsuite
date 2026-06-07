"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PurchaseOrderTable } from "@/components/ptp/PurchaseOrderTable";
import { Button } from "@/components/ui/button";
import { usePurchaseOrders } from "@/hooks/ptp/usePurchaseOrders";

export default function PurchaseOrdersPage() {
  const { orders, loading } = usePurchaseOrders();

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="View and manage all purchase orders."
        actions={
          <Button asChild>
            <Link href="/purchase-orders/new"><Plus className="h-4 w-4 mr-2" />Create PO</Link>
          </Button>
        }
      />
      <PurchaseOrderTable orders={orders} loading={loading} />
    </div>
  );
}
