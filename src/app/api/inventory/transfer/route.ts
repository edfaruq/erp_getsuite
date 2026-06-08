import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";
import { getWarehouseByName, transferWarehouseStock } from "@/lib/inventory/stock";

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

    if (fromLocation === toLocation) {
      return NextResponse.json({ error: "Source and destination must differ" }, { status: 400 });
    }

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.itemType !== "INVENTORY") {
      return NextResponse.json({ error: "Only inventory items can be transferred" }, { status: 400 });
    }

    const fromWarehouse = await getWarehouseByName(fromLocation);
    const toWarehouse = await getWarehouseByName(toLocation);
    if (!fromWarehouse || !toWarehouse) {
      return NextResponse.json({ error: "Invalid warehouse location" }, { status: 400 });
    }

    await transferWarehouseStock(itemId, fromWarehouse.id, toWarehouse.id, qty);

    const transfer = await prisma.inventoryTransfer.create({
      data: { itemId, fromLocation, toLocation, qty, memo, createdBy },
    });

    return NextResponse.json({ data: transfer }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to transfer inventory";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
