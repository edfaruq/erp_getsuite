import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";
import { canTransitionPTP } from "@/constants/status";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { approvedBy: actor } = await req.json();
    const approvedBy = await resolveUserId(actor);
    const order = await prisma.purchaseOrder.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!canTransitionPTP(order.status as never, "PENDING_RECEIPT")) {
      return NextResponse.json({ error: `Cannot transition from ${order.status}` }, { status: 400 });
    }
    const updated = await prisma.purchaseOrder.update({
      where: { id: params.id },
      data: { status: "PENDING_RECEIPT", approvedBy },
    });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to approve PO" }, { status: 500 });
  }
}
