import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";
import {
  getDefaultWarehouse,
  resolveWarehouse,
  syncItemStockQty,
} from "@/lib/inventory/stock";

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
    const { itemId, adjustQty, memo, warehouseName, createdBy: actor } = await req.json();
    const createdBy = await resolveUserId(actor);
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.itemType !== "INVENTORY") {
      return NextResponse.json({ error: "Only inventory items can be adjusted" }, { status: 400 });
    }

    const warehouse = warehouseName
      ? await resolveWarehouse(warehouseName)
      : item.warehouseId
        ? await prisma.warehouse.findUnique({ where: { id: item.warehouseId } })
        : await getDefaultWarehouse();

    if (!warehouse) {
      return NextResponse.json({ error: "No warehouse configured" }, { status: 400 });
    }

    const stock = await prisma.warehouseStock.findUnique({
      where: { warehouseId_itemId: { warehouseId: warehouse.id, itemId } },
    });
    const currentWarehouseQty = stock?.qty ?? 0;
    const newWarehouseQty = currentWarehouseQty + adjustQty;

    if (newWarehouseQty < 0) {
      return NextResponse.json({ error: "Adjustment would result in negative stock" }, { status: 400 });
    }

    const adjustment = await prisma.$transaction(async (tx) => {
      if (stock) {
        await tx.warehouseStock.update({
          where: { id: stock.id },
          data: { qty: newWarehouseQty },
        });
      } else {
        await tx.warehouseStock.create({
          data: { warehouseId: warehouse.id, itemId, qty: newWarehouseQty },
        });
      }

      const newQty = item.stockQty + adjustQty;
      await tx.item.update({ where: { id: itemId }, data: { stockQty: newQty } });

      return tx.inventoryAdjustment.create({
        data: { itemId, adjustQty, newQty, memo, createdBy },
      });
    });

    await syncItemStockQty(itemId);

    return NextResponse.json({ data: adjustment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to adjust inventory" }, { status: 500 });
  }
}
