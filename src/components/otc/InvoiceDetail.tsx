"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Invoice } from "@/types/otc.types";

interface InvoiceWithLines extends Invoice {
  salesOrder?: {
    orderNumber: string;
    items: { item: { displayName: string }; quantity: number; rate: number; amount: number }[];
  };
}

interface InvoiceDetailProps {
  invoice: InvoiceWithLines;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const lines = invoice.salesOrder?.items ?? [];

  return (
    <div className="space-y-4">
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
            {invoice.salesOrder && (
              <div><span className="text-muted-foreground">Sales Order:</span> {invoice.salesOrder.orderNumber}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {lines.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{line.item.displayName}</td>
                    <td className="text-right py-2">{line.quantity}</td>
                    <td className="text-right py-2">{formatCurrency(Number(line.rate))}</td>
                    <td className="text-right py-2">{formatCurrency(Number(line.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
