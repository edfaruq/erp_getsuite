import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildItemUpdateData } from "@/lib/inventory/item-fields";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: { warehouse: true },
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      data: { ...item, warehouseName: item.warehouse?.name },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = buildItemUpdateData(body);
    const item = await prisma.item.update({ where: { id: params.id }, data });
    return NextResponse.json({ data: item });
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
