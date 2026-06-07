import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

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
    const count = await prisma.vendorBill.count();
    const bill = await prisma.vendorBill.create({
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
    });
    return NextResponse.json({ data: bill }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create bill" }, { status: 500 });
  }
}
