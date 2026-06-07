import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      where: { itemType: "INVENTORY" },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      data: items.map((i) => ({
        id: i.id,
        itemNumber: i.name,
        displayName: i.displayName,
        location: "Main Warehouse",
        unitType: i.unitType,
        onHand: i.stockQty,
        counted: i.stockQty,
        variance: 0,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch worksheet" }, { status: 500 });
  }
}
