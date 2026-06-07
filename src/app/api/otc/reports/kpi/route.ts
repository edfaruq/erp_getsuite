import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [openInvoices, customers, payments] = await Promise.all([
      prisma.invoice.findMany({ where: { status: "OPEN" } }),
      prisma.customer.count(),
      prisma.customerPayment.findMany({ include: { invoice: true } }),
    ]);

    const totalReceivables = openInvoices.reduce((s, i) => s + Number(i.total), 0);

    let avgDaysToReceive = 0;
    if (payments.length > 0) {
      const totalDays = payments.reduce((s, p) => {
        const days = Math.floor(
          (p.createdAt.getTime() - p.invoice.date.getTime()) / (1000 * 60 * 60 * 24)
        );
        return s + Math.max(days, 0);
      }, 0);
      avgDaysToReceive = Math.round(totalDays / payments.length);
    }

    return NextResponse.json({
      data: {
        totalReceivables,
        avgDaysToReceive,
        newCustomers: customers,
        openInvoiceCount: openInvoices.length,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate OTC KPI" }, { status: 500 });
  }
}
