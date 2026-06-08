import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await prisma.physicalCountSession.findFirst({
      where: { status: "DRAFT" },
      include: { lines: true },
      orderBy: { createdAt: "desc" },
    });
    const variances = session?.lines.filter((l) => l.variance !== 0) ?? [];
    return NextResponse.json({ data: variances });
  } catch {
    return NextResponse.json({ error: "Failed to fetch variances" }, { status: 500 });
  }
}
