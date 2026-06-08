"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { InvoiceDetail } from "@/components/otc/InvoiceDetail";
import { Invoice } from "@/types/otc.types";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetch(`/api/otc/invoices/${id}`).then((r) => r.json()).then((d) => setInvoice(d.data ?? null));
  }, [id]);

  if (!invoice) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title="Invoice Detail" />
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}
