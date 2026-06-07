import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function daysBetween(from: Date, to: Date) {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { status: "OPEN" },
      include: { customer: true },
    });

    const now = new Date();
    const byCustomer = new Map<
      string,
      { customerId: string; customerName: string; current: number; days30: number; days60: number; days90: number; total: number }
    >();

    for (const inv of invoices) {
      const key = inv.customerId;
      const row = byCustomer.get(key) ?? {
        customerId: inv.customerId,
        customerName: inv.customer.name,
        current: 0,
        days30: 0,
        days60: 0,
        days90: 0,
        total: 0,
      };
      const amount = Number(inv.total);
      const days = daysBetween(inv.dueDate, now);

      if (days <= 0) row.current += amount;
      else if (days <= 30) row.days30 += amount;
      else if (days <= 60) row.days60 += amount;
      else row.days90 += amount;

      row.total += amount;
      byCustomer.set(key, row);
    }

    const rows = Array.from(byCustomer.values()).sort((a, b) => b.total - a.total);
    const summary = {
      totalReceivables: rows.reduce((s, r) => s + r.total, 0),
      customerCount: rows.length,
    };

    return NextResponse.json({ data: { rows, summary } });
  } catch {
    return NextResponse.json({ error: "Failed to generate A/R aging report" }, { status: 500 });
  }
}
