"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ItemForm, ItemFormVariant } from "@/components/inventory/ItemForm";
import { useToastStore } from "@/store/toast.store";

const TITLES: Record<ItemFormVariant, { title: string; description: string }> = {
  INVENTORY: {
    title: "Create Inventory Item",
    description: "Define an inventory item with stock tracking and costing.",
  },
  NON_INVENTORY: {
    title: "Create Non-Inventory Item",
    description: "Define a non-inventory item for purchase and sale without stock tracking.",
  },
  SERVICE: {
    title: "Create Service Item",
    description: "Define a service item for sale (non-taxable by default).",
  },
};

function parseVariant(type: string | null): ItemFormVariant {
  if (type === "NON_INVENTORY" || type === "SERVICE") return type;
  return "INVENTORY";
}

function NewItemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variant = parseVariant(searchParams.get("type"));
  const meta = TITLES[variant];
  const showToast = useToastStore((s) => s.showToast);

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/inventory/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showToast("Item created successfully!");
      router.push("/items");
    } else {
      const json = await res.json();
      showToast(json.error ?? "Failed to create item", "error");
    }
  };

  return (
    <div>
      <PageHeader title={meta.title} description={meta.description} />
      <ItemForm variant={variant} onSubmit={handleSubmit} />
    </div>
  );
}

export default function NewItemPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
      <NewItemContent />
    </Suspense>
  );
}
