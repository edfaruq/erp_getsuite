import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET() {
  try {
    const payments = await prisma.customerPayment.findMany({
      include: { customer: true, invoice: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      data: payments.map((p) => ({ ...p, amount: Number(p.amount), date: p.date.toISOString() })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customerId, invoiceId, amount, account, arAccount, memo, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.status !== "OPEN") {
      return NextResponse.json({ error: "Invoice not eligible for payment" }, { status: 400 });
    }
    const count = await prisma.customerPayment.count();
    const payment = await prisma.$transaction(async (tx) => {
      const p = await tx.customerPayment.create({
        data: {
          paymentNumber: `CP-${String(count + 50001)}`,
          customerId,
          invoiceId,
          amount,
          account: account ?? "Undeposited Funds",
          arAccount: arAccount ?? "Accounts Receivable",
          memo,
          createdBy,
        },
      });
      await tx.invoice.update({ where: { id: invoiceId }, data: { status: "PAID" } });
      await tx.salesOrder.update({ where: { id: invoice.salesOrderId }, data: { status: "PAID" } });
      return p;
    });
    return NextResponse.json({ data: payment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
