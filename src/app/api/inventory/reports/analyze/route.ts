import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item.findMany({ orderBy: { name: "asc" } });

    const inventory = items.filter((i) => i.itemType === "INVENTORY");
    const nonInventory = items.filter((i) => i.itemType === "NON_INVENTORY");
    const service = items.filter((i) => i.itemType === "SERVICE");
    const lowStock = inventory.filter((i) => i.stockQty < 5);
    const zeroStock = inventory.filter((i) => i.stockQty === 0);

    return NextResponse.json({
      data: {
        summary: {
          totalItems: items.length,
          inventoryCount: inventory.length,
          nonInventoryCount: nonInventory.length,
          serviceCount: service.length,
          totalOnHand: inventory.reduce((s, i) => s + i.stockQty, 0),
          lowStockCount: lowStock.length,
          zeroStockCount: zeroStock.length,
        },
        lowStock: lowStock.map((i) => ({
          id: i.id,
          name: i.displayName,
          stockQty: i.stockQty,
        })),
        topOnHand: [...inventory]
          .sort((a, b) => b.stockQty - a.stockQty)
          .slice(0, 5)
          .map((i) => ({ id: i.id, name: i.displayName, stockQty: i.stockQty })),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to analyze inventory" }, { status: 500 });
  }
}
