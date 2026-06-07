import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lines = await prisma.purchaseOrderItem.findMany({
      include: { item: true, purchaseOrder: true },
    });

    const byItem = new Map<string, { itemId: string; itemName: string; quantity: number; spend: number }>();

    for (const line of lines) {
      const row = byItem.get(line.itemId) ?? {
        itemId: line.itemId,
        itemName: line.item.displayName,
        quantity: 0,
        spend: 0,
      };
      row.quantity += line.quantity;
      row.spend += Number(line.amount);
      byItem.set(line.itemId, row);
    }

    const rows = Array.from(byItem.values()).sort((a, b) => b.spend - a.spend);
    return NextResponse.json({ data: rows });
  } catch {
    return NextResponse.json({ error: "Failed to fetch purchase by item" }, { status: 500 });
  }
}
