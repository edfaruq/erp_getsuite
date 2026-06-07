import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [openBills, vendors, payments] = await Promise.all([
      prisma.vendorBill.findMany({ where: { status: "APPROVED" } }),
      prisma.vendor.count(),
      prisma.billPayment.findMany({ include: { bill: true } }),
    ]);

    const totalPayables = openBills.reduce((s, b) => s + Number(b.amount), 0);

    let avgDaysToPay = 0;
    if (payments.length > 0) {
      const totalDays = payments.reduce((s, p) => {
        const days = Math.floor(
          (p.createdAt.getTime() - p.bill.date.getTime()) / (1000 * 60 * 60 * 24)
        );
        return s + Math.max(days, 0);
      }, 0);
      avgDaysToPay = Math.round(totalDays / payments.length);
    }

    return NextResponse.json({
      data: {
        totalPayables,
        avgDaysToPay,
        activeVendors: vendors,
        billsToPayCount: openBills.length,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate PTP KPI" }, { status: 500 });
  }
}
