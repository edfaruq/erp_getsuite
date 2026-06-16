"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const baseSchema = z.object({
  name: z.string().min(1, "Item number required"),
  displayName: z.string().min(1, "Display name required"),
  itemType: z.enum(["INVENTORY", "NON_INVENTORY", "SERVICE"]),
  vendorName: z.string().optional(),
  department: z.string().optional(),
  class: z.string().optional(),
  location: z.string().optional(),
  unitType: z.string().optional(),
  primaryStockUnit: z.string().optional(),
  primaryPurchaseUnit: z.string().optional(),
  primarySaleUnit: z.string().optional(),
  costingMethod: z.enum(["FIFO", "LIFO", "AVERAGE", "STANDARD"]).optional(),
  taxSchedule: z.enum(["TAXABLE", "NON_TAXABLE"]).optional(),
  stockQty: z.coerce.number().optional(),
  reorderPoint: z.coerce.number().optional(),
  warehouseId: z.string().optional(),
  purchaseRate: z.coerce.number().nullable().optional(),
  saleRate: z.coerce.number().nullable().optional(),
  cogsAccount: z.string().optional(),
  assetAccount: z.string().optional(),
  incomeAccount: z.string().optional(),
  expenseAccount: z.string().optional(),
});

type FormData = z.infer<typeof baseSchema>;

export type ItemFormVariant = "INVENTORY" | "NON_INVENTORY" | "SERVICE";

interface ItemFormProps {
  variant: ItemFormVariant;
  mode?: "create" | "edit";
  onSubmit: (data: FormData) => Promise<void>;
  defaultValues?: Partial<FormData>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

export function ItemForm({ variant, mode = "create", onSubmit, defaultValues }: ItemFormProps) {
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/inventory/warehouses")
      .then((r) => r.json())
      .then((d) => setWarehouses(d.data ?? []));
  }, []);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      itemType: variant,
      costingMethod: "FIFO",
      unitType: "Each",
      taxSchedule: variant === "SERVICE" ? "NON_TAXABLE" : "TAXABLE",
      stockQty: 0,
      reorderPoint: 5,
      primaryStockUnit: "Each",
      primaryPurchaseUnit: "Each",
      primarySaleUnit: "Each",
      location: "Main Warehouse",
      purchaseRate: 0,
      saleRate: 0,
      ...defaultValues,
    },
  });

  const titles: Record<ItemFormVariant, string> = {
    INVENTORY: "Inventory Item",
    NON_INVENTORY: "Non-Inventory Item",
    SERVICE: "Service Item",
  };

  const submit = (data: FormData) => onSubmit({ ...data, itemType: variant });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 max-w-2xl">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Item Number">
          <Input {...register("name")} placeholder="SKU-001" readOnly={mode === "edit"} />
        </Field>
        <Field label="Display Name">
          <Input {...register("displayName")} />
        </Field>

        {variant !== "SERVICE" && (
          <Field label="Vendor Name">
            <Input {...register("vendorName")} placeholder="Preferred vendor" />
          </Field>
        )}

        <Field label="Department">
          <Input {...register("department")} />
        </Field>
        <Field label="Class">
          <Input {...register("class")} />
        </Field>
        {variant === "INVENTORY" && warehouses.length > 0 && (
          <Field label="Warehouse">
            <select {...register("warehouseId")} className={selectClass}>
              <option value="">Default warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </Field>
        )}
        {variant !== "INVENTORY" && (
          <Field label="Location">
            <Input {...register("location")} />
          </Field>
        )}
        <Field label="Unit Type">
          <Input {...register("unitType")} />
        </Field>

        {variant === "INVENTORY" && (
          <>
            <Field label="Primary Stock Unit">
              <Input {...register("primaryStockUnit")} />
            </Field>
            <Field label="Primary Purchase Unit">
              <Input {...register("primaryPurchaseUnit")} />
            </Field>
            <Field label="Primary Sale Unit">
              <Input {...register("primarySaleUnit")} />
            </Field>
            <Field label="Costing Method">
              <select {...register("costingMethod")} className={selectClass}>
                <option value="FIFO">FIFO</option>
                <option value="LIFO">LIFO</option>
                <option value="AVERAGE">Average</option>
                <option value="STANDARD">Standard</option>
              </select>
            </Field>
            <Field label="Initial Stock Qty">
              <Input type="number" {...register("stockQty")} />
            </Field>
            <Field label="Reorder Point">
              <Input type="number" {...register("reorderPoint")} />
            </Field>
            <Field label="COGS Account">
              <Input {...register("cogsAccount")} placeholder="5000 Cost of Goods Sold" />
            </Field>
            <Field label="Asset Account">
              <Input {...register("assetAccount")} placeholder="1200 Inventory Asset" />
            </Field>
            <Field label="Income Account">
              <Input {...register("incomeAccount")} placeholder="4000 Sales Income" />
            </Field>
          </>
        )}

        {variant === "NON_INVENTORY" && (
          <>
            <Field label="Primary Purchase Unit">
              <Input {...register("primaryPurchaseUnit")} />
            </Field>
            <Field label="Primary Sale Unit">
              <Input {...register("primarySaleUnit")} />
            </Field>
            <Field label="Income Account">
              <Input {...register("incomeAccount")} placeholder="4000 Sales Income" />
            </Field>
            <Field label="Expense Account">
              <Input {...register("expenseAccount")} placeholder="6000 Expense" />
            </Field>
          </>
        )}

        {variant === "SERVICE" && (
          <>
            <Field label="Primary Sale Unit">
              <Input {...register("primarySaleUnit")} />
            </Field>
            <Field label="Income Account">
              <Input {...register("incomeAccount")} placeholder="4100 Service Income" />
            </Field>
          </>
        )}

        <Field label="Tax Schedule">
          <select {...register("taxSchedule")} className={selectClass}>
            <option value="TAXABLE">Taxable</option>
            <option value="NON_TAXABLE">Non-Taxable</option>
          </select>
        </Field>

        <Field label="Purchase Rate">
          <Input type="number" step="0.01" min={0} {...register("purchaseRate")} placeholder="0.00" />
        </Field>
        <Field label="Sale Rate">
          <Input type="number" step="0.01" min={0} {...register("saleRate")} placeholder="0.00" />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : `Save ${titles[variant]}`}
        </Button>
      </div>
    </form>
  );
}
