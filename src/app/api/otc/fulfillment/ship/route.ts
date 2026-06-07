import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET() {
  try {
    const orders = await prisma.salesOrder.findMany({
      where: { status: "PACKING" },
      include: { customer: true },
    });
    return NextResponse.json({ data: orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch ship queue" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { salesOrderId, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const order = await prisma.salesOrder.findUnique({ where: { id: salesOrderId } });
    if (!order || order.status !== "PACKING") {
      return NextResponse.json({ error: "Order not eligible for shipping" }, { status: 400 });
    }
    const [fulfillment, updated] = await prisma.$transaction([
      prisma.itemFulfillment.create({ data: { salesOrderId, status: "SHIPPED", createdBy } }),
      prisma.salesOrder.update({ where: { id: salesOrderId }, data: { status: "SHIPPED" } }),
    ]);
    return NextResponse.json({ data: { fulfillment, order: updated } });
  } catch {
    return NextResponse.json({ error: "Failed to ship order" }, { status: 500 });
  }
}
