"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ptp/vendors/${id}`)
      .then((r) => r.json())
      .then((d) => { setVendor(d.data ?? null); setLoading(false); });
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!vendor) return <p className="text-muted-foreground">Vendor not found.</p>;

  const purchaseOrders = (vendor.purchaseOrders as { id: string; poNumber: string; status: string; date: string }[]) ?? [];
  const vendorBills = (vendor.vendorBills as { id: string; billNumber: string; status: string; amount: number; dueDate: string }[]) ?? [];

  return (
    <div>
      <PageHeader title={vendor.name as string} description="Vendor detail and transaction history." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{(vendor.email as string) || "—"}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{(vendor.phone as string) || "—"}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{(vendor.address as string) || "—"}</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Purchase Orders</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {purchaseOrders.length === 0 ? <p className="text-sm text-muted-foreground">No purchase orders.</p> : purchaseOrders.map((po) => (
              <div key={po.id} className="flex justify-between text-sm border-b pb-2">
                <Link href={`/purchase-orders/${po.id}`} className="text-primary hover:underline">{po.poNumber}</Link>
                <span className="text-muted-foreground">{po.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Bills</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {vendorBills.length === 0 ? <p className="text-sm text-muted-foreground">No bills.</p> : vendorBills.map((bill) => (
              <div key={bill.id} className="flex justify-between text-sm border-b pb-2">
                <Link href={`/bills/${bill.id}`} className="text-primary hover:underline">{bill.billNumber}</Link>
                <span>{formatCurrency(bill.amount)} · {formatDate(bill.dueDate)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
