import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { stocks: true } } },
    });
    return NextResponse.json({ data: warehouses });
  } catch {
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, code } = await req.json();
    if (!name || !code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
    }
    const warehouse = await prisma.warehouse.create({
      data: { name: String(name).trim(), code: String(code).trim().toUpperCase() },
    });
    return NextResponse.json({ data: warehouse }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 });
  }
}
