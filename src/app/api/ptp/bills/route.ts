import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";
import { canTransitionPTP } from "@/constants/status";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const bills = await prisma.vendorBill.findMany({
      where: status ? { status: status as never } : undefined,
      include: { vendor: true, purchaseOrder: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      data: bills.map((b) => ({
        ...b,
        vendorName: b.vendor.name,
        amount: Number(b.amount),
        date: b.date.toISOString(),
        dueDate: b.dueDate.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { vendorId, purchaseOrderId, dueDate, amount, memo, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    if (purchaseOrderId) {
      const po = await prisma.purchaseOrder.findUnique({
        where: { id: purchaseOrderId },
        include: { bills: true },
      });
      if (!po) return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
      if (!canTransitionPTP(po.status as never, "BILLED")) {
        return NextResponse.json({ error: `PO must be RECEIVED to bill (current: ${po.status})` }, { status: 400 });
      }
      if (po.bills.some((b) => b.status !== "PAID")) {
        return NextResponse.json({ error: "PO already has an open bill" }, { status: 400 });
      }
    }

    const count = await prisma.vendorBill.count();
    const bill = await prisma.$transaction(async (tx) => {
      const created = await tx.vendorBill.create({
        data: {
          billNumber: `BILL-${String(count + 40001)}`,
          vendorId,
          purchaseOrderId: purchaseOrderId || null,
          dueDate: new Date(dueDate),
          amount,
          memo,
          status: "PENDING_APPROVAL",
          createdBy,
        },
        include: { vendor: true, purchaseOrder: true },
      });
      if (purchaseOrderId) {
        await tx.purchaseOrder.update({
          where: { id: purchaseOrderId },
          data: { status: "BILLED" },
        });
      }
      return created;
    });
    return NextResponse.json({ data: bill }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create bill" }, { status: 500 });
  }
}
