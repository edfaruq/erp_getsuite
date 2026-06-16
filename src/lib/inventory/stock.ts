import { prisma } from "@/lib/prisma";

export async function getWarehouseByName(name: string) {
  return prisma.warehouse.findFirst({ where: { name } });
}

export async function getDefaultWarehouse() {
  return prisma.warehouse.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function resolveWarehouse(location?: string | null) {
  if (location) {
    const byName = await getWarehouseByName(location);
    if (byName) return byName;
  }
  return getDefaultWarehouse();
}

export async function syncItemStockQty(itemId: string) {
  const stocks = await prisma.warehouseStock.findMany({ where: { itemId } });
  const total = stocks.reduce((sum, s) => sum + s.qty, 0);
  await prisma.item.update({ where: { id: itemId }, data: { stockQty: total } });
  return total;
}

export async function ensureWarehouseStock(itemId: string, warehouseId: string, qty = 0) {
  return prisma.warehouseStock.upsert({
    where: { warehouseId_itemId: { warehouseId, itemId } },
    create: { warehouseId, itemId, qty },
    update: {},
  });
}

export async function incrementWarehouseStock(
  itemId: string,
  warehouseId: string,
  qty: number
) {
  await prisma.warehouseStock.upsert({
    where: { warehouseId_itemId: { warehouseId, itemId } },
    create: { warehouseId, itemId, qty },
    update: { qty: { increment: qty } },
  });
  return syncItemStockQty(itemId);
}

export async function decrementWarehouseStock(
  itemId: string,
  warehouseId: string,
  qty: number
) {
  const stock = await prisma.warehouseStock.findUnique({
    where: { warehouseId_itemId: { warehouseId, itemId } },
  });
  const available = stock?.qty ?? 0;
  if (available < qty) {
    throw new Error(`Insufficient stock at warehouse (${available} available, ${qty} required)`);
  }
  await prisma.warehouseStock.update({
    where: { warehouseId_itemId: { warehouseId, itemId } },
    data: { qty: { decrement: qty } },
  });
  return syncItemStockQty(itemId);
}

export async function transferWarehouseStock(
  itemId: string,
  fromWarehouseId: string,
  toWarehouseId: string,
  qty: number
) {
  await decrementWarehouseStock(itemId, fromWarehouseId, qty);
  await incrementWarehouseStock(itemId, toWarehouseId, qty);
}

export function computePurchaseOrderStatus(
  items: { itemId: string; quantity: number }[],
  receipts: { itemId: string; qtyReceived: number }[]
) {
  let allReceived = true;
  let anyReceived = false;

  for (const line of items) {
    const received = receipts
      .filter((r) => r.itemId === line.itemId)
      .reduce((sum, r) => sum + r.qtyReceived, 0);
    if (received > 0) anyReceived = true;
    if (received < line.quantity) allReceived = false;
  }

  if (allReceived && items.length > 0) return "RECEIVED" as const;
  if (anyReceived) return "PARTIALLY_RECEIVED" as const;
  return "PENDING_RECEIPT" as const;
}
