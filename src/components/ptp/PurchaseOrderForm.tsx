"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const lineSchema = z.object({
  itemId: z.string().min(1),
  rate: z.coerce.number().min(0),
  quantity: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
});

const schema = z.object({
  vendorId: z.string().min(1, "Vendor required"),
  location: z.string().optional(),
  memo: z.string().optional(),
  items: z.array(lineSchema).min(1),
});

type FormData = z.infer<typeof schema>;

interface PurchaseOrderFormProps {
  vendors: { id: string; name: string }[];
  items: { id: string; displayName: string; purchaseRate?: number | null }[];
  onSubmit: (data: FormData) => Promise<void>;
}

export function PurchaseOrderForm({ vendors, items, onSubmit }: PurchaseOrderFormProps) {
  const { register, control, handleSubmit, getValues, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { location: "Main Warehouse", items: [{ itemId: "", rate: 0, quantity: 1, amount: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Watch all itemId values to detect changes
  const watchedLines = useWatch({ control, name: "items" });
  const prevItemIds = useRef<string[]>([]);

  useEffect(() => {
    watchedLines.forEach((line, index) => {
      const currentId = line.itemId ?? "";
      const prevId = prevItemIds.current[index] ?? "";
      if (currentId && currentId !== prevId) {
        const selected = items.find((i) => i.id === currentId);
        const rate = Number(selected?.purchaseRate ?? 0);
        if (rate > 0) {
          setValue(`items.${index}.rate`, rate, { shouldDirty: true });
          const qty = Number(line.quantity ?? 1);
          setValue(`items.${index}.amount`, rate * qty, { shouldDirty: true });
        }
      }
    });
    prevItemIds.current = watchedLines.map((l) => l.itemId ?? "");
  }, [watchedLines, items, setValue]);

  const updateAmount = (index: number) => {
    const rate = Number(getValues(`items.${index}.rate`) ?? 0);
    const qty = Number(getValues(`items.${index}.quantity`) ?? 0);
    setValue(`items.${index}.amount`, rate * qty, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vendor</Label>
          <select {...register("vendorId")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select vendor...</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input {...register("location")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Memo</Label>
          <Input {...register("memo")} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Line Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ itemId: "", rate: 0, quantity: 1, amount: 0 })}>
              <Plus className="h-4 w-4 mr-1" /> Add Line
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4 space-y-1">
                <Label className="text-xs">Item</Label>
                <select
                  {...register(`items.${index}.itemId`)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option value="">Select...</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Rate</Label>
                <Input type="number" step="0.01" {...register(`items.${index}.rate`)} onBlur={() => updateAmount(index)} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Qty</Label>
                <Input type="number" {...register(`items.${index}.quantity`)} onBlur={() => updateAmount(index)} />
              </div>
              <div className="col-span-3 space-y-1">
                <Label className="text-xs">Amount</Label>
                <Input type="number" step="0.01" {...register(`items.${index}.amount`)} readOnly />
              </div>
              <div className="col-span-1">
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Create Purchase Order"}
      </Button>
    </form>
  );
}
