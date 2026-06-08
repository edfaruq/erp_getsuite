"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  salesOrderId: z.string().min(1, "Sales order required"),
  dueDate: z.string().min(1, "Due date required"),
});

type FormData = z.infer<typeof schema>;

interface ShippedOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customer?: { name: string };
  items?: { amount: number }[];
}

interface InvoiceCreateFormProps {
  orders: ShippedOrder[];
  onSubmit: (data: FormData & { customerId: string }) => Promise<void>;
}

export function InvoiceCreateForm({ orders, onSubmit }: InvoiceCreateFormProps) {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    },
  });

  const selectedId = watch("salesOrderId");
  const selected = orders.find((o) => o.id === selectedId);
  const total = selected?.items?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;

  const handleFormSubmit = async (data: FormData) => {
    if (!selected) return;
    await onSubmit({ ...data, customerId: selected.customerId });
  };

  if (orders.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">Invoice Shipped Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label>Sales Order</Label>
            <select
              {...register("salesOrderId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select shipped order...</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} — {o.customerName ?? o.customer?.name}
                </option>
              ))}
            </select>
          </div>
          {selected && (
            <p className="text-sm text-muted-foreground">
              Order total: {formatCurrency(total)}
            </p>
          )}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" {...register("dueDate")} />
          </div>
          <Button type="submit" disabled={isSubmitting || !selectedId}>
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
