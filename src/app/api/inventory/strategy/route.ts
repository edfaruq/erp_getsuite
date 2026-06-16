import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ITEM_STRATEGY = `Focus inventory investment on high-velocity SKUs with strong margin contribution.

• Maintain minimum 30 days cover on A-class inventory items
• Review slow-moving stock monthly and trigger transfer or adjustment workflows
• Standardize service items for recurring revenue bundles
• Align item classes with departmental P&L reporting structure`;

const DEFAULT_REPORTING_STRATEGY = `Executive dashboards consolidate operational KPIs with financial aging and item-level performance trends.

• Weekly: inventory on-hand, low-stock alerts, fulfillment queue depth
• Monthly: sales-by-item and purchase-by-item variance vs plan
• Monthly: A/R and A/P aging with DSO/DPO targets
• Quarterly: item strategy review and catalog rationalization`;

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    if (type !== "item" && type !== "reporting") {
      return NextResponse.json({ error: "type must be item or reporting" }, { status: 400 });
    }

    const key = type === "item" ? "item_strategy" : "reporting_strategy";
    const setting = await prisma.systemSetting.findUnique({ where: { key } });
    const value =
      setting?.value ?? (type === "item" ? DEFAULT_ITEM_STRATEGY : DEFAULT_REPORTING_STRATEGY);

    return NextResponse.json({ data: { type, content: value } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch strategy" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { type, content } = await req.json();
    if ((type !== "item" && type !== "reporting") || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const key = type === "item" ? "item_strategy" : "reporting_strategy";
    const setting = await prisma.systemSetting.upsert({
      where: { key },
      create: { key, value: content },
      update: { value: content },
    });

    return NextResponse.json({ data: { type, content: setting.value } });
  } catch {
    return NextResponse.json({ error: "Failed to save strategy" }, { status: 500 });
  }
}
