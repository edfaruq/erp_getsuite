"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  vendorId: z.string().min(1, "Vendor required"),
  purchaseOrderId: z.string().optional(),
  dueDate: z.string().min(1, "Due date required"),
  amount: z.coerce.number().min(0.01),
  memo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BillFormProps {
  vendors: { id: string; name: string }[];
  onSubmit: (data: FormData) => Promise<void>;
}

export function BillForm({ vendors, onSubmit }: BillFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label>Vendor</Label>
        <select {...register("vendorId")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Select vendor...</option>
          {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label>PO Reference (optional)</Label>
        <Input {...register("purchaseOrderId")} placeholder="Purchase Order ID" />
      </div>
      <div className="space-y-2">
        <Label>Due Date</Label>
        <Input type="date" {...register("dueDate")} />
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input type="number" step="0.01" {...register("amount")} />
      </div>
      <div className="space-y-2">
        <Label>Memo</Label>
        <Input {...register("memo")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Create Bill"}
      </Button>
    </form>
  );
}
