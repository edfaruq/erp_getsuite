import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canTransitionOTC } from "@/constants/status";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.salesOrder.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!canTransitionOTC(order.status as never, "PENDING_APPROVAL")) {
      return NextResponse.json(
        { error: `Cannot submit order in ${order.status} status` },
        { status: 400 }
      );
    }

    const updated = await prisma.salesOrder.update({
      where: { id: params.id },
      data: { status: "PENDING_APPROVAL" },
    });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to submit sales order" }, { status: 500 });
  }
}
