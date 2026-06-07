import { AppRole } from "./roles";
import { ROUTES } from "./routes";

export type MenuIcon =
  | "ShoppingCart"
  | "Plus"
  | "CheckCircle"
  | "Package"
  | "Archive"
  | "Truck"
  | "Download"
  | "Box"
  | "RefreshCw"
  | "ArrowLeftRight"
  | "BarChart"
  | "BarChart2"
  | "FileText"
  | "DollarSign"
  | "ClipboardList"
  | "Receipt"
  | "LayoutDashboard"
  | "Users"
  | "PlusSquare"
  | "TrendingUp"
  | "TrendingDown"
  | "Settings"
  | "Settings2";

export interface MenuItem {
  label: string;
  href: string;
  icon: MenuIcon;
}

const COMMON_DASHBOARD: MenuItem = {
  label: "Dashboard",
  href: ROUTES.dashboard,
  icon: "LayoutDashboard",
};

export const ROLE_MENUS: Record<AppRole, MenuItem[]> = {
  SALES_REP: [
    COMMON_DASHBOARD,
    { label: "Sales Orders", href: ROUTES.salesOrders, icon: "ShoppingCart" },
    { label: "Create Sales Order", href: ROUTES.salesOrdersNew, icon: "Plus" },
  ],
  SALES_MANAGER: [
    COMMON_DASHBOARD,
    { label: "Sales Orders", href: ROUTES.salesOrders, icon: "ShoppingCart" },
    { label: "Approvals", href: ROUTES.approvals, icon: "CheckCircle" },
  ],
  INVENTORY_MANAGER: [
    COMMON_DASHBOARD,
    { label: "Pick Orders", href: ROUTES.pick, icon: "Package" },
    { label: "Pack Orders", href: ROUTES.pack, icon: "Archive" },
    { label: "Ship Orders", href: ROUTES.ship, icon: "Truck" },
    { label: "Receive PO", href: ROUTES.receive, icon: "Download" },
    { label: "Items", href: ROUTES.items, icon: "Box" },
    { label: "Adjust Inventory", href: ROUTES.adjust, icon: "RefreshCw" },
    { label: "Transfer Inventory", href: ROUTES.transfer, icon: "ArrowLeftRight" },
    { label: "Physical Worksheet", href: ROUTES.physicalWorksheet, icon: "ClipboardList" },
    { label: "KPI & Reminders", href: ROUTES.inventoryKpi, icon: "BarChart" },
  ],
  AR_ANALYST: [
    COMMON_DASHBOARD,
    { label: "Sales Orders", href: ROUTES.salesOrders, icon: "ShoppingCart" },
    { label: "Invoices", href: ROUTES.invoices, icon: "FileText" },
    { label: "Accept Payment", href: ROUTES.customerPayments, icon: "DollarSign" },
    { label: "A/R Aging Report", href: ROUTES.arAging, icon: "BarChart2" },
    { label: "KPI & Scorecard", href: ROUTES.arKpi, icon: "TrendingUp" },
  ],
  PURCHASING_MANAGER: [
    COMMON_DASHBOARD,
    { label: "Purchase Orders", href: ROUTES.purchaseOrders, icon: "ClipboardList" },
    { label: "Create PO", href: ROUTES.purchaseOrdersNew, icon: "Plus" },
    { label: "Vendor Master", href: ROUTES.vendors, icon: "Users" },
    { label: "Items", href: ROUTES.items, icon: "Box" },
    { label: "Create Inventory Item", href: ROUTES.itemsNew("INVENTORY"), icon: "PlusSquare" },
    { label: "Create Non-Inventory Item", href: ROUTES.itemsNew("NON_INVENTORY"), icon: "PlusSquare" },
    { label: "Create Service Item", href: ROUTES.itemsNew("SERVICE"), icon: "PlusSquare" },
    { label: "Purchase by Items", href: ROUTES.purchaseByItems, icon: "BarChart" },
  ],
  AP_ANALYST: [
    COMMON_DASHBOARD,
    { label: "Purchase Orders", href: ROUTES.purchaseOrders, icon: "ClipboardList" },
    { label: "Bills", href: ROUTES.bills, icon: "Receipt" },
    { label: "New Standalone Bill", href: ROUTES.billsNew, icon: "Plus" },
    { label: "Bill Payments", href: ROUTES.billPayments, icon: "DollarSign" },
    { label: "A/P Aging Report", href: ROUTES.apAging, icon: "BarChart2" },
    { label: "KPI & Scorecard", href: ROUTES.apKpi, icon: "TrendingUp" },
  ],
  ACCOUNTING_MANAGER: [
    COMMON_DASHBOARD,
    { label: "Bill Approvals", href: ROUTES.billApprovals, icon: "CheckCircle" },
    { label: "Bills", href: ROUTES.bills, icon: "Receipt" },
  ],
  CEO_CFO: [
    COMMON_DASHBOARD,
    { label: "Define Item Strategy", href: ROUTES.itemStrategy, icon: "Settings" },
    { label: "Define Reporting Strategy", href: ROUTES.reportingStrategy, icon: "Settings2" },
    { label: "Items", href: ROUTES.items, icon: "Box" },
    { label: "Sales by Item", href: ROUTES.salesByItems, icon: "TrendingUp" },
    { label: "Purchase by Items", href: ROUTES.purchaseByItems, icon: "TrendingDown" },
    { label: "Analyze Inventory", href: ROUTES.analyzeInventory, icon: "BarChart" },
  ],
};

export function getMenuForRole(role: AppRole): MenuItem[] {
  return ROLE_MENUS[role] ?? [];
}
