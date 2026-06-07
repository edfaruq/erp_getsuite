import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET() {
  try {
    const payments = await prisma.billPayment.findMany({
      include: { vendor: true, bill: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      data: payments.map((p) => ({ ...p, amount: Number(p.amount), date: p.date.toISOString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bill payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { vendorId, billId, amount, apAccount, account, memo, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const bill = await prisma.vendorBill.findUnique({ where: { id: billId } });
    if (!bill || bill.status !== "APPROVED") {
      return NextResponse.json({ error: "Bill must be APPROVED to pay" }, { status: 400 });
    }
    const count = await prisma.billPayment.count();
    const payment = await prisma.$transaction(async (tx) => {
      const p = await tx.billPayment.create({
        data: {
          paymentNumber: `BP-${String(count + 60001)}`,
          vendorId,
          billId,
          amount,
          apAccount: apAccount ?? "Accounts Payable",
          account: account ?? "Checking",
          memo,
          createdBy,
        },
      });
      await tx.vendorBill.update({ where: { id: billId }, data: { status: "PAID" } });
      if (bill.purchaseOrderId) {
        await tx.purchaseOrder.update({ where: { id: bill.purchaseOrderId }, data: { status: "PAID" } });
      }
      return p;
    });
    return NextResponse.json({ data: payment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create bill payment" }, { status: 500 });
  }
}
