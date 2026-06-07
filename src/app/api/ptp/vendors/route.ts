import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      include: { _count: { select: { purchaseOrders: true, vendorBills: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({
      data: vendors.map((v) => ({
        ...v,
        createdAt: v.createdAt.toISOString(),
        poCount: v._count.purchaseOrders,
        billCount: v._count.vendorBills,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vendor = await prisma.vendor.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
      },
    });
    return NextResponse.json({ data: vendor }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
