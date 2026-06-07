import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function daysBetween(from: Date, to: Date) {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export async function GET() {
  try {
    const bills = await prisma.vendorBill.findMany({
      where: { status: { in: ["PENDING_APPROVAL", "APPROVED"] } },
      include: { vendor: true },
    });

    const now = new Date();
    const byVendor = new Map<
      string,
      { vendorId: string; vendorName: string; current: number; days30: number; days60: number; days90: number; total: number }
    >();

    for (const bill of bills) {
      const key = bill.vendorId;
      const row = byVendor.get(key) ?? {
        vendorId: bill.vendorId,
        vendorName: bill.vendor.name,
        current: 0,
        days30: 0,
        days60: 0,
        days90: 0,
        total: 0,
      };
      const amount = Number(bill.amount);
      const days = daysBetween(bill.dueDate, now);

      if (days <= 0) row.current += amount;
      else if (days <= 30) row.days30 += amount;
      else if (days <= 60) row.days60 += amount;
      else row.days90 += amount;

      row.total += amount;
      byVendor.set(key, row);
    }

    const rows = Array.from(byVendor.values()).sort((a, b) => b.total - a.total);
    const summary = {
      totalPayables: rows.reduce((s, r) => s + r.total, 0),
      vendorCount: rows.length,
    };

    return NextResponse.json({ data: { rows, summary } });
  } catch {
    return NextResponse.json({ error: "Failed to generate A/P aging report" }, { status: 500 });
  }
}
