"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Invoice } from "@/types/otc.types";

const schema = z.object({
  invoiceId: z.string().min(1, "Invoice required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  account: z.string().optional(),
  arAccount: z.string().optional(),
  memo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface PaymentFormProps {
  openInvoices: Invoice[];
  onSubmit: (data: FormData & { customerId: string }) => Promise<void>;
}

export function PaymentForm({ openInvoices, onSubmit }: PaymentFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      account: "Undeposited Funds",
      arAccount: "Accounts Receivable",
    },
  });

  const selectedId = watch("invoiceId");
  const selected = openInvoices.find((inv) => inv.id === selectedId);

  useEffect(() => {
    if (selected) setValue("amount", selected.total);
  }, [selected, setValue]);

  const handleFormSubmit = async (data: FormData) => {
    if (!selected) return;
    await onSubmit({ ...data, customerId: selected.customerId });
  };

  if (openInvoices.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">Accept Customer Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label>Invoice</Label>
            <select
              {...register("invoiceId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select open invoice...</option>
              {openInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.customerName} ({formatCurrency(inv.total)})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" step="0.01" {...register("amount")} />
          </div>
          <div className="space-y-2">
            <Label>Deposit Account</Label>
            <Input {...register("account")} />
          </div>
          <div className="space-y-2">
            <Label>A/R Account</Label>
            <Input {...register("arAccount")} />
          </div>
          <div className="space-y-2">
            <Label>Memo</Label>
            <Input {...register("memo")} placeholder="Optional notes..." />
          </div>
          <Button type="submit" disabled={isSubmitting || !selectedId}>
            {isSubmitting ? "Recording..." : "Record Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
