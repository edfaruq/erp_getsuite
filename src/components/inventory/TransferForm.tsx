"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  itemId: z.string().min(1, "Item required"),
  fromLocation: z.string().min(1, "From location required"),
  toLocation: z.string().min(1, "To location required"),
  qty: z.coerce.number().min(1, "Quantity must be at least 1"),
  memo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TransferFormProps {
  items: { id: string; displayName: string; stockQty: number }[];
  onSubmit: (data: FormData) => Promise<void>;
}

export function TransferForm({ items, onSubmit }: TransferFormProps) {
  const [warehouses, setWarehouses] = useState<{ name: string }[]>([]);

  useEffect(() => {
    fetch("/api/inventory/warehouses")
      .then((r) => r.json())
      .then((d) => setWarehouses((d.data ?? []).filter((w: { isActive: boolean }) => w.isActive)));
  }, []);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromLocation: "Main Warehouse",
      toLocation: "Secondary Warehouse",
    },
  });

  const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label>Item</Label>
        <select {...register("itemId")} className={selectClass}>
          <option value="">Select item...</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>{i.displayName} (On Hand: {i.stockQty})</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>From Location</Label>
          {warehouses.length > 0 ? (
            <select {...register("fromLocation")} className={selectClass}>
              {warehouses.map((w) => (
                <option key={w.name} value={w.name}>{w.name}</option>
              ))}
            </select>
          ) : (
            <Input {...register("fromLocation")} />
          )}
        </div>
        <div className="space-y-2">
          <Label>To Location</Label>
          {warehouses.length > 0 ? (
            <select {...register("toLocation")} className={selectClass}>
              {warehouses.map((w) => (
                <option key={w.name} value={w.name}>{w.name}</option>
              ))}
            </select>
          ) : (
            <Input {...register("toLocation")} />
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Quantity</Label>
        <Input type="number" {...register("qty")} />
      </div>
      <div className="space-y-2">
        <Label>Memo</Label>
        <Input {...register("memo")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Transfer Inventory"}
      </Button>
    </form>
  );
}
