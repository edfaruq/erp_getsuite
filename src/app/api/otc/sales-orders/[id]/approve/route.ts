import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";
import { canTransitionOTC } from "@/constants/status";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { action, approvedBy } = await req.json();
    const approverId = action === "approve" ? await resolveUserId(approvedBy) : null;
    const order = await prisma.salesOrder.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const nextStatus = action === "approve" ? "APPROVED" : "REJECTED";
    if (!canTransitionOTC(order.status as never, nextStatus as never)) {
      return NextResponse.json({ error: `Cannot transition from ${order.status} to ${nextStatus}` }, { status: 400 });
    }

    const updated = await prisma.salesOrder.update({
      where: { id: params.id },
      data: { status: nextStatus, approvedBy: approverId },
    });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to process approval" }, { status: 500 });
  }
}
