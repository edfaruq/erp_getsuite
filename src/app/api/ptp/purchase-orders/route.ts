import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const orders = await prisma.purchaseOrder.findMany({
      where: status ? { status: status as never } : undefined,
      include: { vendor: true, items: { include: { item: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      data: orders.map((o) => ({
        ...o,
        vendorName: o.vendor.name,
        date: o.date.toISOString(),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: o.items.map((i) => ({ ...i, itemName: i.item.displayName, rate: Number(i.rate), amount: Number(i.amount) })),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const createdBy = await resolveUserId(body.createdBy);
    const count = await prisma.purchaseOrder.count();
    const order = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${String(count + 20001)}`,
        vendorId: body.vendorId,
        date: body.date ? new Date(body.date) : new Date(),
        location: body.location ?? "Main Warehouse",
        currency: body.currency ?? "USD",
        memo: body.memo,
        status: "DRAFT",
        createdBy,
        items: {
          create: body.items.map((item: { itemId: string; dept?: string; class?: string; rate: number; quantity: number; amount: number }) => ({
            itemId: item.itemId,
            dept: item.dept,
            class: item.class,
            rate: item.rate,
            quantity: item.quantity,
            amount: item.amount,
          })),
        },
      },
      include: { vendor: true, items: { include: { item: true } } },
    });
    return NextResponse.json({ data: order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 });
  }
}
