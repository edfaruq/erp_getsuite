import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const invoices = await prisma.invoice.findMany({
      where: status ? { status: status as never } : undefined,
      include: { customer: true, salesOrder: true },
      orderBy: { createdAt: "desc" },
    });
    const data = invoices.map((inv) => ({
      ...inv,
      customerName: inv.customer.name,
      subtotal: Number(inv.subtotal),
      total: Number(inv.total),
      date: inv.date.toISOString(),
      dueDate: inv.dueDate.toISOString(),
    }));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { salesOrderId, customerId, dueDate, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const order = await prisma.salesOrder.findUnique({
      where: { id: salesOrderId },
      include: { items: true },
    });
    if (!order || order.status !== "SHIPPED") {
      return NextResponse.json({ error: "Order must be SHIPPED to invoice" }, { status: 400 });
    }
    const subtotal = order.items.reduce((sum, i) => sum + Number(i.amount), 0);
    const count = await prisma.invoice.count();
    const invoice = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.create({
        data: {
          invoiceNumber: `INV-${String(count + 30001)}`,
          salesOrderId,
          customerId,
          dueDate: new Date(dueDate),
          subtotal,
          total: subtotal,
          createdBy,
        },
      });
      await tx.salesOrder.update({ where: { id: salesOrderId }, data: { status: "INVOICED" } });
      return inv;
    });
    return NextResponse.json({ data: invoice }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
