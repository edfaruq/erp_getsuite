import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET() {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      where: { status: { in: ["PENDING_RECEIPT", "PARTIALLY_RECEIVED"] } },
      include: { vendor: true, items: { include: { item: true } }, receipts: true },
    });
    return NextResponse.json({ data: orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch receive queue" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { purchaseOrderId, itemId, qtyReceived, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { items: true, receipts: true },
    });
    if (!po) return NextResponse.json({ error: "PO not found" }, { status: 404 });

    const poItem = po.items.find((i) => i.itemId === itemId);
    if (!poItem) return NextResponse.json({ error: "Item not on PO" }, { status: 400 });

    const priorReceived = po.receipts.filter((r) => r.itemId === itemId).reduce((s, r) => s + r.qtyReceived, 0);
    if (priorReceived + qtyReceived > poItem.quantity) {
      return NextResponse.json({ error: "Quantity exceeds ordered amount" }, { status: 400 });
    }

    const receiptTotals = new Map<string, number>();
    for (const r of po.receipts) {
      receiptTotals.set(r.itemId, (receiptTotals.get(r.itemId) ?? 0) + r.qtyReceived);
    }
    receiptTotals.set(itemId, (receiptTotals.get(itemId) ?? 0) + qtyReceived);

    const allFullyReceived = po.items.every((item) => (receiptTotals.get(item.itemId) ?? 0) >= item.quantity);
    const anyReceived = po.items.some((item) => (receiptTotals.get(item.itemId) ?? 0) > 0);
    const nextStatus = allFullyReceived ? "RECEIVED" : anyReceived ? "PARTIALLY_RECEIVED" : po.status;

    const [receipt, updatedPO, updatedItem] = await prisma.$transaction([
      prisma.itemReceipt.create({ data: { purchaseOrderId, itemId, qtyReceived, createdBy } }),
      prisma.purchaseOrder.update({ where: { id: purchaseOrderId }, data: { status: nextStatus } }),
      prisma.item.update({ where: { id: itemId }, data: { stockQty: { increment: qtyReceived } } }),
    ]);

    return NextResponse.json({ data: { receipt, order: updatedPO, item: updatedItem } });
  } catch {
    return NextResponse.json({ error: "Failed to receive items" }, { status: 500 });
  }
}
