import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [items, adjustments, transfers, pickQueue, receiveQueue, draftCounts] = await Promise.all([
      prisma.item.findMany({ where: { itemType: "INVENTORY" } }),
      prisma.inventoryAdjustment.count(),
      prisma.inventoryTransfer.count(),
      prisma.salesOrder.count({ where: { status: "APPROVED" } }),
      prisma.purchaseOrder.count({ where: { status: { in: ["PENDING_RECEIPT", "PARTIALLY_RECEIVED"] } } }),
      prisma.physicalCountSession.count({ where: { status: "DRAFT" } }),
    ]);

    const totalOnHand = items.reduce((s, i) => s + i.stockQty, 0);
    const lowStockCount = items.filter((i) => i.stockQty < i.reorderPoint).length;

    let worksheetVariances = 0;
    const draftSession = await prisma.physicalCountSession.findFirst({
      where: { status: "DRAFT" },
      include: { lines: true },
    });
    if (draftSession) {
      worksheetVariances = draftSession.lines.filter((l) => l.variance !== 0).length;
    }

    return NextResponse.json({
      data: {
        skuCount: items.length,
        totalOnHand,
        lowStockCount,
        adjustmentsCount: adjustments,
        transfersCount: transfers,
        ordersToPick: pickQueue,
        posToReceive: receiveQueue,
        draftWorksheets: draftCounts,
        worksheetVariances,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch inventory KPI" }, { status: 500 });
  }
}
