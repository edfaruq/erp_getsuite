import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildItemCreateData } from "@/lib/inventory/item-fields";
import { ensureWarehouseStock, getDefaultWarehouse } from "@/lib/inventory/stock";

export async function GET(req: NextRequest) {
  try {
    const lowStock = req.nextUrl.searchParams.get("lowStock") === "true";
    const itemType = req.nextUrl.searchParams.get("itemType");

    const items = await prisma.item.findMany({
      where: {
        ...(itemType ? { itemType: itemType as "INVENTORY" | "NON_INVENTORY" | "SERVICE" } : {}),
        ...(lowStock ? { itemType: "INVENTORY" } : {}),
      },
      include: { warehouse: true },
      orderBy: { name: "asc" },
    });

    const filtered = lowStock
      ? items.filter((i) => i.stockQty < i.reorderPoint)
      : items;

    return NextResponse.json({
      data: filtered.map((i) => ({
        ...i,
        warehouseName: i.warehouse?.name,
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
    const createData = buildItemCreateData(body);

    const warehouse = createData.warehouseId
      ? await prisma.warehouse.findUnique({ where: { id: createData.warehouseId } })
      : createData.itemType === "INVENTORY"
        ? await getDefaultWarehouse()
        : null;

    const { warehouseId: _wh, ...rest } = createData;
    const item = await prisma.item.create({
      data: {
        ...rest,
        warehouseId: createData.itemType === "INVENTORY" ? (warehouse?.id ?? null) : null,
      },
    });

    if (item.itemType === "INVENTORY" && item.stockQty > 0 && warehouse) {
      await ensureWarehouseStock(item.id, warehouse.id, item.stockQty);
      await prisma.warehouseStock.update({
        where: { warehouseId_itemId: { warehouseId: warehouse.id, itemId: item.id } },
        data: { qty: item.stockQty },
      });
    }

    return NextResponse.json({ data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
