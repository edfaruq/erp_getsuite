import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";

export async function GET() {
  try {
    const adjustments = await prisma.inventoryAdjustment.findMany({
      include: { item: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({
      data: adjustments.map((a) => ({
        ...a,
        itemName: a.item.displayName,
        date: a.date.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch adjustments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { itemId, adjustQty, memo, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    const newQty = item.stockQty + adjustQty;
    const [adjustment] = await prisma.$transaction([
      prisma.inventoryAdjustment.create({
        data: { itemId, adjustQty, newQty, memo, createdBy },
      }),
      prisma.item.update({ where: { id: itemId }, data: { stockQty: newQty } }),
    ]);
    return NextResponse.json({ data: adjustment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to adjust inventory" }, { status: 500 });
  }
}
