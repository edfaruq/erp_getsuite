import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canTransitionOTC } from "@/constants/status";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.salesOrder.findUnique({
      where: { id: params.id },
      include: { customer: true, items: { include: { item: true } }, fulfillments: true, invoices: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      data: {
        ...order,
        customerName: order.customer.name,
        date: order.date.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch sales order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const existing = await prisma.salesOrder.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.status && body.status !== existing.status) {
      if (!canTransitionOTC(existing.status as never, body.status as never)) {
        return NextResponse.json(
          { error: `Cannot transition from ${existing.status} to ${body.status}` },
          { status: 400 }
        );
      }
    }

    const order = await prisma.salesOrder.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: "Failed to update sales order" }, { status: 500 });
  }
}
