import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET() {
  try {
    const transfers = await prisma.inventoryTransfer.findMany({
      include: { item: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({
      data: transfers.map((t) => ({
        ...t,
        itemName: t.item.displayName,
        date: t.date.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch transfers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { itemId, fromLocation, toLocation, qty, memo, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.stockQty < qty) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }
    const transfer = await prisma.inventoryTransfer.create({
      data: { itemId, fromLocation, toLocation, qty, memo, createdBy },
    });
    return NextResponse.json({ data: transfer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to transfer inventory" }, { status: 500 });
  }
}
