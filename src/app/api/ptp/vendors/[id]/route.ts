import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
      include: {
        purchaseOrders: { orderBy: { createdAt: "desc" }, take: 10 },
        vendorBills: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      data: {
        ...vendor,
        createdAt: vendor.createdAt.toISOString(),
        purchaseOrders: vendor.purchaseOrders.map((po) => ({
          ...po,
          date: po.date.toISOString(),
        })),
        vendorBills: vendor.vendorBills.map((b) => ({
          ...b,
          amount: Number(b.amount),
          date: b.date.toISOString(),
          dueDate: b.dueDate.toISOString(),
        })),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 404 });
  }
}
