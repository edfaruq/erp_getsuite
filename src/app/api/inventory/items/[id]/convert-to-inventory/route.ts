import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureWarehouseStock, getDefaultWarehouse } from "@/lib/inventory/stock";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const item = await prisma.item.findUnique({ where: { id: params.id } });

    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.itemType !== "NON_INVENTORY") {
      return NextResponse.json(
        { error: "Only non-inventory items can be converted" },
        { status: 400 }
      );
    }

    const warehouse =
      (body.warehouseId
        ? await prisma.warehouse.findUnique({ where: { id: body.warehouseId } })
        : null) ?? (await getDefaultWarehouse());

    const stockQty = Number(body.stockQty ?? 0);
    const reorderPoint = Number(body.reorderPoint ?? 5);

    const updated = await prisma.item.update({
      where: { id: params.id },
      data: {
        itemType: "INVENTORY",
        stockQty,
        reorderPoint,
        warehouseId: warehouse.id,
        costingMethod: body.costingMethod ?? item.costingMethod ?? "FIFO",
        primaryStockUnit: body.primaryStockUnit ?? item.primaryStockUnit ?? item.unitType,
      },
    });

    await ensureWarehouseStock(updated.id, warehouse.id, 0);
    if (stockQty > 0) {
      await prisma.warehouseStock.update({
        where: { warehouseId_itemId: { warehouseId: warehouse.id, itemId: updated.id } },
        data: { qty: stockQty },
      });
    }

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to convert item" }, { status: 500 });
  }
}
