"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Invoice } from "@/types/otc.types";

interface InvoiceDetailProps {
  invoice: Invoice;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{invoice.invoiceNumber}</CardTitle>
          <StatusBadge status={invoice.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-muted-foreground">Customer:</span> {invoice.customerName}</div>
          <div><span className="text-muted-foreground">Date:</span> {formatDate(invoice.date)}</div>
          <div><span className="text-muted-foreground">Due Date:</span> {formatDate(invoice.dueDate)}</div>
          <div><span className="text-muted-foreground">Total:</span> {formatCurrency(invoice.total)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
