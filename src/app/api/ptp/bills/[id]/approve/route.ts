import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bill = await prisma.vendorBill.findUnique({ where: { id: params.id } });
    if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (bill.status !== "PENDING_APPROVAL") {
      return NextResponse.json({ error: "Bill not pending approval" }, { status: 400 });
    }
    const updated = await prisma.vendorBill.update({
      where: { id: params.id },
      data: { status: "APPROVED" },
    });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to approve bill" }, { status: 500 });
  }
}
