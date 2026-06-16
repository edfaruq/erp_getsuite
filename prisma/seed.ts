import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // Users (one per role)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "sales.rep@erp.com" },
      update: {},
      create: { name: "Alex Chen", email: "sales.rep@erp.com", password, role: "SALES_REP" },
    }),
    prisma.user.upsert({
      where: { email: "sales.manager@erp.com" },
      update: {},
      create: { name: "Jordan Lee", email: "sales.manager@erp.com", password, role: "SALES_MANAGER" },
    }),
    prisma.user.upsert({
      where: { email: "inventory@erp.com" },
      update: {},
      create: { name: "Sam Rivera", email: "inventory@erp.com", password, role: "INVENTORY_MANAGER" },
    }),
    prisma.user.upsert({
      where: { email: "ar@erp.com" },
      update: {},
      create: { name: "Taylor Brooks", email: "ar@erp.com", password, role: "AR_ANALYST" },
    }),
    prisma.user.upsert({
      where: { email: "purchasing@erp.com" },
      update: {},
      create: { name: "Morgan Patel", email: "purchasing@erp.com", password, role: "PURCHASING_MANAGER" },
    }),
    prisma.user.upsert({
      where: { email: "ap@erp.com" },
      update: {},
      create: { name: "Casey Nguyen", email: "ap@erp.com", password, role: "AP_ANALYST" },
    }),
    prisma.user.upsert({
      where: { email: "accounting@erp.com" },
      update: {},
      create: { name: "Riley Kim", email: "accounting@erp.com", password, role: "ACCOUNTING_MANAGER" },
    }),
    prisma.user.upsert({
      where: { email: "ceo@erp.com" },
      update: {},
      create: { name: "Dana Wright", email: "ceo@erp.com", password, role: "CEO_CFO" },
    }),
  ]);

  const [salesRep, salesManager, inventoryMgr, arAnalyst, purchasingMgr, apAnalyst] = users;

  // Customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { id: "cust-zenith" },
      update: {},
      create: { id: "cust-zenith", name: "10 Zenith Systems", email: "orders@zenithsystems.com", phone: "+1-555-0101", address: "100 Innovation Blvd, San Jose, CA", currency: "USD" },
    }),
    prisma.customer.upsert({
      where: { id: "cust-bain" },
      update: {},
      create: { id: "cust-bain", name: "18 Bain Consulting", email: "procurement@bainconsulting.com", phone: "+1-555-0102", address: "18 Market Street, Boston, MA", currency: "USD" },
    }),
    prisma.customer.upsert({
      where: { id: "cust-acme" },
      update: {},
      create: { id: "cust-acme", name: "Acme Corporation", email: "buyer@acme.com", phone: "+1-555-0103", address: "500 Industrial Way, Chicago, IL", currency: "USD" },
    }),
    prisma.customer.upsert({
      where: { id: "cust-globex" },
      update: {},
      create: { id: "cust-globex", name: "Globex International", email: "sales@globex.com", phone: "+1-555-0104", address: "200 Export Lane, Miami, FL", currency: "USD" },
    }),
    prisma.customer.upsert({
      where: { id: "cust-initech" },
      update: {},
      create: { id: "cust-initech", name: "Initech Solutions", email: "orders@initech.com", phone: "+1-555-0105", address: "42 Software Ave, Austin, TX", currency: "USD" },
    }),
  ]);

  const [zenith, bain] = customers;

  // Vendors
  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: { id: "vendor-apple" },
      update: {},
      create: { id: "vendor-apple", name: "Apple Store", email: "b2b@apple.com", phone: "+1-555-0201", address: "1 Apple Park Way, Cupertino, CA" },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-bist" },
      update: {},
      create: { id: "vendor-bist", name: "Bist Electronics", email: "orders@bistelectronics.com", phone: "+1-555-0202", address: "88 Circuit Road, Dallas, TX" },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-dell" },
      update: {},
      create: { id: "vendor-dell", name: "Dell Technologies", email: "enterprise@dell.com", phone: "+1-555-0203", address: "1 Dell Way, Round Rock, TX" },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-cisco" },
      update: {},
      create: { id: "vendor-cisco", name: "Cisco Systems", email: "supply@cisco.com", phone: "+1-555-0204", address: "170 West Tasman Dr, San Jose, CA" },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-office" },
      update: {},
      create: { id: "vendor-office", name: "Office Depot", email: "b2b@officedepot.com", phone: "+1-555-0205", address: "6600 North Military Trail, Boca Raton, FL" },
    }),
  ]);

  const [appleStore, bistElectronics] = vendors;

  // Warehouses
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { code: "MAIN" },
    update: {},
    create: { name: "Main Warehouse", code: "MAIN", isActive: true },
  });
  const secondaryWarehouse = await prisma.warehouse.upsert({
    where: { code: "SEC" },
    update: {},
    create: { name: "Secondary Warehouse", code: "SEC", isActive: true },
  });

  // Items
  const items = await Promise.all([
    prisma.item.upsert({
      where: { name: "IPAD-PRO-97-32GB" },
      update: {},
      create: { name: "IPAD-PRO-97-32GB", displayName: "iPad Pro 9.7 inch - 32GB", itemType: "INVENTORY", costingMethod: "FIFO", unitType: "Each", taxSchedule: "TAXABLE", stockQty: 45, reorderPoint: 10, warehouseId: mainWarehouse.id, purchaseRate: 499.99, saleRate: 649.99, department: "Electronics", class: "Tablets" },
    }),
    prisma.item.upsert({
      where: { name: "BROCADE-7800-SW" },
      update: {},
      create: { name: "BROCADE-7800-SW", displayName: "Brocade 7800 Extension Switch", itemType: "INVENTORY", costingMethod: "AVERAGE", unitType: "Each", taxSchedule: "TAXABLE", stockQty: 12, reorderPoint: 5, warehouseId: mainWarehouse.id, purchaseRate: 9800.00, saleRate: 12500.00, department: "Networking", class: "Switches" },
    }),
    prisma.item.upsert({
      where: { name: "MACBOOK-PRO-M3" },
      update: {},
      create: { name: "MACBOOK-PRO-M3", displayName: "MacBook Pro 14\" M3", itemType: "INVENTORY", costingMethod: "FIFO", unitType: "Each", taxSchedule: "TAXABLE", stockQty: 28, reorderPoint: 8, warehouseId: mainWarehouse.id, purchaseRate: 1599.99, saleRate: 1999.99, department: "Electronics", class: "Laptops" },
    }),
    prisma.item.upsert({
      where: { name: "CISCO-2960-SW" },
      update: {},
      create: { name: "CISCO-2960-SW", displayName: "Cisco Catalyst 2960 Switch", itemType: "INVENTORY", costingMethod: "STANDARD", unitType: "Each", taxSchedule: "TAXABLE", stockQty: 3, reorderPoint: 5, warehouseId: mainWarehouse.id, purchaseRate: 2500.00, saleRate: 3200.00, department: "Networking", class: "Switches" },
    }),
    prisma.item.upsert({
      where: { name: "IT-CONSULT-HR" },
      update: {},
      create: { name: "IT-CONSULT-HR", displayName: "IT Consulting - Hourly", itemType: "SERVICE", costingMethod: "STANDARD", unitType: "Hour", taxSchedule: "TAXABLE", stockQty: 0, purchaseRate: 0, saleRate: 150.00, department: "Services", class: "Consulting" },
    }),
    prisma.item.upsert({
      where: { name: "SHIPPING-HANDLING" },
      update: {},
      create: { name: "SHIPPING-HANDLING", displayName: "Shipping & Handling Fee", itemType: "NON_INVENTORY", costingMethod: "STANDARD", unitType: "Each", taxSchedule: "NON_TAXABLE", stockQty: 0, purchaseRate: 0, saleRate: 25.00, department: "Logistics", class: "Fees" },
    }),
    prisma.item.upsert({
      where: { name: "DELL-POWEREDGE-R750" },
      update: {},
      create: { name: "DELL-POWEREDGE-R750", displayName: "Dell PowerEdge R750 Server", itemType: "INVENTORY", costingMethod: "FIFO", unitType: "Each", taxSchedule: "TAXABLE", stockQty: 5, reorderPoint: 3, warehouseId: secondaryWarehouse.id, purchaseRate: 3200.00, saleRate: 4500.00, department: "Servers", class: "Hardware" },
    }),
    prisma.item.upsert({
      where: { name: "OFFICE-CHAIR-EXEC" },
      update: {},
      create: { name: "OFFICE-CHAIR-EXEC", displayName: "Executive Office Chair", itemType: "INVENTORY", costingMethod: "AVERAGE", unitType: "Each", taxSchedule: "TAXABLE", stockQty: 20, reorderPoint: 5, warehouseId: mainWarehouse.id, purchaseRate: 350.00, saleRate: 550.00, department: "Furniture", class: "Office" },
    }),
  ]);

  const inventoryItems = items.filter((i) => i.itemType === "INVENTORY");
  for (const item of inventoryItems) {
    const warehouseId = item.warehouseId ?? mainWarehouse.id;
    await prisma.warehouseStock.upsert({
      where: { warehouseId_itemId: { warehouseId, itemId: item.id } },
      update: { qty: item.stockQty },
      create: { warehouseId, itemId: item.id, qty: item.stockQty },
    });
  }

  const [ipad, brocade, macbook, cisco] = items;

  // Sales Order 1 — PENDING_APPROVAL
  const so1 = await prisma.salesOrder.upsert({
    where: { orderNumber: "SO-10001" },
    update: {},
    create: {
      orderNumber: "SO-10001",
      customerId: zenith.id,
      date: new Date("2025-05-15"),
      location: "Main Warehouse",
      currency: "USD",
      memo: "Q2 hardware refresh for Zenith Systems",
      status: "PENDING_APPROVAL",
      createdBy: salesRep.id,
      items: {
        create: [
          { itemId: ipad.id, dept: "Electronics", class: "Tablets", priceLevel: "Standard", rate: 649.99, quantity: 10, taxCode: "TAX-US", amount: 6499.90 },
          { itemId: macbook.id, dept: "Electronics", class: "Laptops", priceLevel: "Standard", rate: 1999.99, quantity: 5, taxCode: "TAX-US", amount: 9999.95 },
        ],
      },
    },
  });

  // Sales Order 2 — APPROVED (ready for picking)
  const so2 = await prisma.salesOrder.upsert({
    where: { orderNumber: "SO-10002" },
    update: {},
    create: {
      orderNumber: "SO-10002",
      customerId: bain.id,
      date: new Date("2025-05-20"),
      location: "Main Warehouse",
      currency: "USD",
      memo: "Network infrastructure upgrade",
      status: "APPROVED",
      createdBy: salesRep.id,
      approvedBy: salesManager.id,
      items: {
        create: [
          { itemId: brocade.id, dept: "Networking", class: "Switches", priceLevel: "Standard", rate: 12500.00, quantity: 2, taxCode: "TAX-US", amount: 25000.00 },
        ],
      },
    },
  });

  // Purchase Order 1 — PENDING_RECEIPT
  const po1 = await prisma.purchaseOrder.upsert({
    where: { poNumber: "PO-20001" },
    update: {},
    create: {
      poNumber: "PO-20001",
      vendorId: appleStore.id,
      date: new Date("2025-05-10"),
      location: "Main Warehouse",
      currency: "USD",
      memo: "iPad restock order",
      status: "PENDING_RECEIPT",
      createdBy: purchasingMgr.id,
      items: {
        create: [
          { itemId: ipad.id, dept: "Electronics", class: "Tablets", rate: 499.99, quantity: 20, amount: 9999.80 },
        ],
      },
    },
  });

  // Purchase Order 2 — PARTIALLY_RECEIVED
  const po2 = await prisma.purchaseOrder.upsert({
    where: { poNumber: "PO-20002" },
    update: {},
    create: {
      poNumber: "PO-20002",
      vendorId: bistElectronics.id,
      date: new Date("2025-05-12"),
      location: "Main Warehouse",
      currency: "USD",
      memo: "Brocade switch procurement",
      status: "PARTIALLY_RECEIVED",
      createdBy: purchasingMgr.id,
      items: {
        create: [
          { itemId: brocade.id, dept: "Networking", class: "Switches", rate: 9800.00, quantity: 4, amount: 39200.00 },
        ],
      },
    },
  });

  await prisma.itemReceipt.upsert({
    where: { id: "receipt-001" },
    update: {},
    create: {
      id: "receipt-001",
      purchaseOrderId: po2.id,
      itemId: brocade.id,
      qtyReceived: 2,
      date: new Date("2025-05-18"),
      createdBy: inventoryMgr.id,
    },
  });

  // Sales Order 3 — SHIPPED/INVOICED (completed OTC path for A/R demo)
  const so3 = await prisma.salesOrder.upsert({
    where: { orderNumber: "SO-10003" },
    update: {},
    create: {
      orderNumber: "SO-10003",
      customerId: zenith.id,
      date: new Date("2025-05-18"),
      location: "Main Warehouse",
      currency: "USD",
      memo: "Completed order for A/R aging demo",
      status: "SHIPPED",
      createdBy: salesRep.id,
      approvedBy: salesManager.id,
      items: {
        create: [
          { itemId: cisco.id, dept: "Networking", class: "Switches", priceLevel: "Standard", rate: 3200.00, quantity: 1, taxCode: "TAX-US", amount: 3200.00 },
        ],
      },
    },
  });

  await prisma.itemFulfillment.createMany({
    data: [
      { salesOrderId: so3.id, status: "PICKED", createdBy: inventoryMgr.id },
      { salesOrderId: so3.id, status: "PACKED", createdBy: inventoryMgr.id },
      { salesOrderId: so3.id, status: "SHIPPED", createdBy: inventoryMgr.id },
    ],
    skipDuplicates: true,
  });

  const invoice = await prisma.invoice.upsert({
    where: { invoiceNumber: "INV-30001" },
    update: {},
    create: {
      invoiceNumber: "INV-30001",
      salesOrderId: so3.id,
      customerId: zenith.id,
      date: new Date("2025-05-25"),
      dueDate: new Date("2025-06-25"),
      subtotal: 3200.00,
      total: 3200.00,
      status: "OPEN",
      createdBy: arAnalyst.id,
    },
  });

  await prisma.salesOrder.update({
    where: { id: so3.id },
    data: { status: "INVOICED" },
  });

  // Vendor Bill
  await prisma.vendorBill.upsert({
    where: { billNumber: "BILL-40001" },
    update: {},
    create: {
      billNumber: "BILL-40001",
      vendorId: bistElectronics.id,
      purchaseOrderId: po2.id,
      date: new Date("2025-05-20"),
      dueDate: new Date("2025-06-20"),
      amount: 19600.00,
      status: "PENDING_APPROVAL",
      memo: "Partial receipt billing for Brocade switches",
      createdBy: apAnalyst.id,
    },
  });

  console.log("Seed completed successfully");
  console.log({ customers: customers.length, vendors: vendors.length, items: items.length, so1: so1.orderNumber, so2: so2.orderNumber, po1: po1.poNumber, po2: po2.poNumber, invoice: invoice.invoiceNumber });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
