import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lines = await prisma.salesOrderItem.findMany({
      include: { item: true, salesOrder: true },
    });

    const byItem = new Map<string, { itemId: string; itemName: string; quantity: number; revenue: number }>();

    for (const line of lines) {
      const row = byItem.get(line.itemId) ?? {
        itemId: line.itemId,
        itemName: line.item.displayName,
        quantity: 0,
        revenue: 0,
      };
      row.quantity += line.quantity;
      row.revenue += Number(line.amount);
      byItem.set(line.itemId, row);
    }

    const rows = Array.from(byItem.values()).sort((a, b) => b.revenue - a.revenue);
    return NextResponse.json({ data: rows });
  } catch {
    return NextResponse.json({ error: "Failed to fetch sales by item" }, { status: 500 });
  }
}
