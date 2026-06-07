import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_THRESHOLD = 5;

export async function GET(req: NextRequest) {
  try {
    const lowStock = req.nextUrl.searchParams.get("lowStock") === "true";

    const items = await prisma.item.findMany({
      where: lowStock
        ? { itemType: "INVENTORY", stockQty: { lt: LOW_STOCK_THRESHOLD } }
        : undefined,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      data: items.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.item.create({
      data: {
        name: body.name,
        displayName: body.displayName,
        itemType: body.itemType,
        costingMethod: body.costingMethod ?? "FIFO",
        unitType: body.unitType ?? "Each",
        taxSchedule: body.taxSchedule ?? "TAXABLE",
        stockQty: body.itemType === "INVENTORY" ? (body.stockQty ?? 0) : 0,
        department: body.department,
        class: body.class,
      },
    });
    return NextResponse.json({ data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
