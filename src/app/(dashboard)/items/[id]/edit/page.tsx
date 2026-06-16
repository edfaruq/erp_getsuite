"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ItemForm, ItemFormVariant } from "@/components/inventory/ItemForm";
import { Item } from "@/types/inventory.types";
import { useToastStore } from "@/store/toast.store";

export default function ItemEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    fetch(`/api/inventory/items/${id}`)
      .then((r) => r.json())
      .then((d) => setItem(d.data));
  }, [id]);

  if (!item) return <p className="text-muted-foreground">Loading...</p>;

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/inventory/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showToast("Item updated successfully!");
      router.push(`/items/${id}`);
    } else {
      const json = await res.json();
      showToast(json.error ?? "Failed to update item", "error");
    }
  };

  return (
    <div>
      <PageHeader title={`Edit ${item.displayName}`} description={item.name} />
      <ItemForm
        mode="edit"
        variant={item.itemType as ItemFormVariant}
        defaultValues={item}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
