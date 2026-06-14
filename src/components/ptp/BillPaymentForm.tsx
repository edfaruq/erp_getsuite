"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorBill } from "@/types/ptp.types";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  billId: z.string().min(1, "Bill required"),
  apAccount: z.string().min(1),
  account: z.string().min(1),
  memo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BillPaymentFormProps {
  bills: VendorBill[];
  onSubmit: (data: FormData & { vendorId: string; amount: number }) => Promise<void>;
  defaultBillId?: string;
}

export function BillPaymentForm({ bills, onSubmit, defaultBillId }: BillPaymentFormProps) {
  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      billId: defaultBillId ?? "",
      apAccount: "Accounts Payable",
      account: "Checking",
    },
  });

  const selectedBillId = watch("billId");
  const selectedBill = bills.find((b) => b.id === selectedBillId);

  const handleFormSubmit = async (data: FormData) => {
    if (!selectedBill) return;
    await onSubmit({
      ...data,
      vendorId: selectedBill.vendorId,
      amount: selectedBill.amount,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Record Bill Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label>Approved Bill</Label>
            <select
              {...register("billId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select bill...</option>
              {bills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.billNumber} — {b.vendorName} — {formatCurrency(b.amount)}
                </option>
              ))}
            </select>
            {errors.billId && <p className="text-sm text-destructive">{errors.billId.message}</p>}
          </div>
          {selectedBill && (
            <p className="text-sm text-muted-foreground">
              Payment amount: <span className="font-medium text-foreground">{formatCurrency(selectedBill.amount)}</span>
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>A/P Account</Label>
              <Input {...register("apAccount")} />
            </div>
            <div className="space-y-2">
              <Label>Payment Account</Label>
              <Input {...register("account")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Memo</Label>
            <Input {...register("memo")} placeholder="Optional" />
          </div>
          <Button type="submit" disabled={isSubmitting || !selectedBill}>
            {isSubmitting ? "Processing..." : "Pay Bill"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
