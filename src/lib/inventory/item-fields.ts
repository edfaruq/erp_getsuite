import { CostingMethod, ItemType, TaxSchedule } from "@prisma/client";

type ItemBody = Record<string, unknown>;

function str(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  return String(value);
}

export function buildItemCreateData(body: ItemBody) {
  const itemType = body.itemType as ItemType;
  const stockQty = itemType === "INVENTORY" ? Number(body.stockQty ?? 0) : 0;

  return {
    name: String(body.name),
    displayName: String(body.displayName),
    itemType,
    costingMethod: (body.costingMethod as CostingMethod) ?? "FIFO",
    unitType: str(body.unitType) ?? "Each",
    taxSchedule: (body.taxSchedule as TaxSchedule) ?? "TAXABLE",
    stockQty,
    reorderPoint: itemType === "INVENTORY" ? Number(body.reorderPoint ?? 5) : 0,
    warehouseId: str(body.warehouseId),
    vendorName: str(body.vendorName),
    location: str(body.location),
    primaryStockUnit: str(body.primaryStockUnit),
    primaryPurchaseUnit: str(body.primaryPurchaseUnit),
    primarySaleUnit: str(body.primarySaleUnit),
    cogsAccount: str(body.cogsAccount),
    assetAccount: str(body.assetAccount),
    incomeAccount: str(body.incomeAccount),
    expenseAccount: str(body.expenseAccount),
    department: str(body.department),
    class: str(body.class),
  };
}

export function buildItemUpdateData(body: ItemBody) {
  const data: Record<string, unknown> = {};

  const fields = [
    "displayName",
    "costingMethod",
    "unitType",
    "taxSchedule",
    "warehouseId",
    "vendorName",
    "location",
    "primaryStockUnit",
    "primaryPurchaseUnit",
    "primarySaleUnit",
    "cogsAccount",
    "assetAccount",
    "incomeAccount",
    "expenseAccount",
    "department",
    "class",
  ] as const;

  for (const key of fields) {
    if (body[key] !== undefined) data[key] = str(body[key]) ?? null;
  }

  if (body.reorderPoint !== undefined) {
    data.reorderPoint = Number(body.reorderPoint);
  }

  return data;
}
