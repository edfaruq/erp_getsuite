import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bill = await prisma.vendorBill.findUnique({
      where: { id: params.id },
      include: { vendor: true, purchaseOrder: { include: { items: true, receipts: true } }, payments: true },
    });
    if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: bill });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bill" }, { status: 500 });
  }
}
