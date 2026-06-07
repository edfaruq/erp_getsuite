"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SalesOrderTable } from "@/components/otc/SalesOrderTable";
import { Button } from "@/components/ui/button";
import { useSalesOrders } from "@/hooks/otc/useSalesOrders";

export default function SalesOrdersPage() {
  const { orders, loading } = useSalesOrders();

  return (
    <div>
      <PageHeader
        title="Sales Orders"
        description="View and manage all sales orders."
        actions={
          <Button asChild>
            <Link href="/sales-orders/new"><Plus className="h-4 w-4 mr-2" />New Sales Order</Link>
          </Button>
        }
      />
      <SalesOrderTable orders={orders} loading={loading} />
    </div>
  );
}
