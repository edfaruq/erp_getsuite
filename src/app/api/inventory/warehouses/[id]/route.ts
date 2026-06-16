import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const warehouse = await prisma.warehouse.update({
      where: { id: params.id },
      data: {
        name: body.name,
        code: body.code ? String(body.code).trim().toUpperCase() : undefined,
        isActive: body.isActive,
      },
    });
    return NextResponse.json({ data: warehouse });
  } catch {
    return NextResponse.json({ error: "Failed to update warehouse" }, { status: 500 });
  }
}
