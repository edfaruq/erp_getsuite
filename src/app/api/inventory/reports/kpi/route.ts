import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_THRESHOLD = 5;

export async function GET() {
  try {
    const [items, adjustments, transfers, pickQueue, receiveQueue] = await Promise.all([
      prisma.item.findMany({ where: { itemType: "INVENTORY" } }),
      prisma.inventoryAdjustment.count(),
      prisma.inventoryTransfer.count(),
      prisma.salesOrder.count({ where: { status: "APPROVED" } }),
      prisma.purchaseOrder.count({ where: { status: { in: ["PENDING_RECEIPT", "PARTIALLY_RECEIVED"] } } }),
    ]);

    const totalOnHand = items.reduce((s, i) => s + i.stockQty, 0);
    const lowStockCount = items.filter((i) => i.stockQty < LOW_STOCK_THRESHOLD).length;

    return NextResponse.json({
      data: {
        skuCount: items.length,
        totalOnHand,
        lowStockCount,
        adjustmentsCount: adjustments,
        transfersCount: transfers,
        ordersToPick: pickQueue,
        posToReceive: receiveQueue,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch inventory KPI" }, { status: 500 });
  }
}
