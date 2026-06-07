import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { vendor: true, items: { include: { item: true } }, receipts: true, bills: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: "Failed to fetch purchase order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const order = await prisma.purchaseOrder.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: "Failed to update purchase order" }, { status: 500 });
  }
}
