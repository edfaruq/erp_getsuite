import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const orders = await prisma.salesOrder.findMany({
      where: status ? { status: status as never } : undefined,
      include: { customer: true, items: { include: { item: true } } },
      orderBy: { createdAt: "desc" },
    });
    const data = orders.map((o) => ({
      ...o,
      customerName: o.customer.name,
      date: o.date.toISOString(),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: o.items.map((i) => ({
        ...i,
        itemName: i.item.displayName,
        rate: Number(i.rate),
        amount: Number(i.amount),
      })),
    }));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch sales orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const createdBy = await resolveUserId(body.createdBy);
    const count = await prisma.salesOrder.count();
    const order = await prisma.salesOrder.create({
      data: {
        orderNumber: `SO-${String(count + 10001)}`,
        customerId: body.customerId,
        date: body.date ? new Date(body.date) : new Date(),
        location: body.location ?? "Main Warehouse",
        currency: body.currency ?? "USD",
        memo: body.memo,
        status: "PENDING_APPROVAL",
        createdBy,
        items: {
          create: body.items.map((item: { itemId: string; dept?: string; class?: string; priceLevel?: string; rate: number; quantity: number; taxCode?: string; amount: number }) => ({
            itemId: item.itemId,
            dept: item.dept,
            class: item.class,
            priceLevel: item.priceLevel,
            rate: item.rate,
            quantity: item.quantity,
            taxCode: item.taxCode,
            amount: item.amount,
          })),
        },
      },
      include: { customer: true, items: { include: { item: true } } },
    });
    return NextResponse.json({ data: order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create sales order" }, { status: 500 });
  }
}
