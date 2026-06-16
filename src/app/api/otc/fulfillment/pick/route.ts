import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET() {
  try {
    const orders = await prisma.salesOrder.findMany({
      where: { status: "APPROVED" },
      include: {
        customer: true,
        items: { include: { item: true } },
      },
    });
    return NextResponse.json({ data: orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch pick queue" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { salesOrderId, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const order = await prisma.salesOrder.findUnique({
      where: { id: salesOrderId },
      include: { items: { include: { item: true } } },
    });

    if (!order || order.status !== "APPROVED") {
      return NextResponse.json({ error: "Order not eligible for picking" }, { status: 400 });
    }

    for (const line of order.items) {
      if (line.item.itemType !== "INVENTORY") continue;
      if (line.item.stockQty < line.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${line.item.displayName} (need ${line.quantity}, have ${line.item.stockQty})` },
          { status: 400 }
        );
      }
    }

    const [fulfillment, updated] = await prisma.$transaction([
      prisma.itemFulfillment.create({ data: { salesOrderId, status: "PICKED", createdBy } }),
      prisma.salesOrder.update({ where: { id: salesOrderId }, data: { status: "PICKING" } }),
    ]);
    return NextResponse.json({ data: { fulfillment, order: updated } });
  } catch {
    return NextResponse.json({ error: "Failed to pick order" }, { status: 500 });
  }
}
