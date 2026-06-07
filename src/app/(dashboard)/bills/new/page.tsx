"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { BillForm } from "@/components/ptp/BillForm";
import { useRoleStore } from "@/store/role.store";

export default function NewBillPage() {
  const router = useRouter();
  const activeRole = useRoleStore((s) => s.activeRole);

  const vendors = [
    { id: "vendor-apple", name: "Apple Store" },
    { id: "vendor-bist", name: "Bist Electronics" },
    { id: "vendor-dell", name: "Dell Technologies" },
    { id: "vendor-cisco", name: "Cisco Systems" },
    { id: "vendor-office", name: "Office Depot" },
  ];

  const handleSubmit = async (data: { vendorId: string; purchaseOrderId?: string; dueDate: string; amount: number; memo?: string }) => {
    const res = await fetch("/api/ptp/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: activeRole }),
    });
    if (res.ok) router.push("/bills");
  };

  return (
    <div>
      <PageHeader title="Enter Standalone Bill" description="Create a new vendor bill." />
      <BillForm vendors={vendors} onSubmit={handleSubmit} />
    </div>
  );
}
