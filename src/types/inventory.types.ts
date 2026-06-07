export type ItemType = "INVENTORY" | "NON_INVENTORY" | "SERVICE";
export type CostingMethod = "FIFO" | "LIFO" | "AVERAGE" | "STANDARD";
export type TaxSchedule = "TAXABLE" | "NON_TAXABLE";

export interface Item {
  id: string;
  name: string;
  displayName: string;
  itemType: ItemType;
  costingMethod: CostingMethod;
  unitType: string;
  taxSchedule: TaxSchedule;
  stockQty: number;
  department?: string;
  class?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  name: string;
  displayName: string;
  itemType: ItemType;
  costingMethod?: CostingMethod;
  unitType?: string;
  taxSchedule?: TaxSchedule;
  stockQty?: number;
  department?: string;
  class?: string;
}

export interface InventoryAdjustment {
  id: string;
  itemId: string;
  itemName?: string;
  adjustQty: number;
  newQty: number;
  memo?: string;
  date: string;
  createdBy: string;
}

export interface InventoryTransfer {
  id: string;
  itemId: string;
  itemName?: string;
  fromLocation: string;
  toLocation: string;
  qty: number;
  memo?: string;
  date: string;
  createdBy: string;
}
