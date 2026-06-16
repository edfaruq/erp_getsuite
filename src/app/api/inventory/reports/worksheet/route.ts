import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/actor";
import { getDefaultWarehouse } from "@/lib/inventory/stock";

async function getOrCreateDraftSession(createdBy: string) {
  const existing = await prisma.physicalCountSession.findFirst({
    where: { status: "DRAFT" },
    include: { lines: { include: { item: { include: { warehouse: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;

  const warehouse = await getDefaultWarehouse();
  const items = await prisma.item.findMany({
    where: { itemType: "INVENTORY" },
    orderBy: { name: "asc" },
  });

  return prisma.physicalCountSession.create({
    data: {
      createdBy,
      lines: {
        create: items.map((item) => ({
          itemId: item.id,
          onHand: item.stockQty,
          counted: item.stockQty,
          variance: 0,
        })),
      },
    },
    include: { lines: { include: { item: { include: { warehouse: true } } } } },
  });
}

function mapSession(session: {
  id: string;
  status: string;
  lines: {
    id: string;
    itemId: string;
    onHand: number;
    counted: number;
    variance: number;
    item: { name: string; displayName: string; unitType: string; warehouse?: { name: string } | null };
  }[];
}) {
  return {
    sessionId: session.id,
    status: session.status,
    data: [...session.lines]
      .sort((a, b) => a.item.name.localeCompare(b.item.name))
      .map((line) => ({
      id: line.id,
      itemId: line.itemId,
      itemNumber: line.item.name,
      displayName: line.item.displayName,
      location: line.item.warehouse?.name ?? "Main Warehouse",
      unitType: line.item.unitType,
      onHand: line.onHand,
      counted: line.counted,
      variance: line.variance,
    })),
  };
}


export async function GET() {
  try {
    const userId = await resolveUserId("INVENTORY_MANAGER");
    const session = await getOrCreateDraftSession(userId);
    return NextResponse.json(mapSession(session));
  } catch {
    return NextResponse.json({ error: "Failed to fetch worksheet" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, lines, submit, createdBy: actor } = body;

    if (!sessionId || !Array.isArray(lines)) {
      return NextResponse.json({ error: "sessionId and lines are required" }, { status: 400 });
    }

    const session = await prisma.physicalCountSession.findUnique({
      where: { id: sessionId },
      include: { lines: true },
    });
    if (!session || session.status !== "DRAFT") {
      return NextResponse.json({ error: "Worksheet not found or already submitted" }, { status: 400 });
    }

    const createdBy = await resolveUserId(actor ?? "INVENTORY_MANAGER");
    const warehouse = await getDefaultWarehouse();

    if (!warehouse) {
      return NextResponse.json({ error: "No active warehouse configured" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      for (const line of lines as { itemId: string; counted: number }[]) {
        const existing = session.lines.find((l) => l.itemId === line.itemId);
        if (!existing) continue;
        const counted = Math.max(0, Number(line.counted));
        const variance = counted - existing.onHand;
        await tx.physicalCountLine.update({
          where: { id: existing.id },
          data: { counted, variance },
        });

        if (submit && variance !== 0) {
          const item = await tx.item.findUnique({ where: { id: line.itemId } });
          if (!item || item.itemType !== "INVENTORY") continue;

          const newQty = item.stockQty + variance;
          if (newQty < 0) {
            throw new Error(`Adjustment would make ${item.name} negative`);
          }

          await tx.inventoryAdjustment.create({
            data: {
              itemId: line.itemId,
              adjustQty: variance,
              newQty,
              memo: `Physical count adjustment (session ${sessionId.slice(-6)})`,
              createdBy,
            },
          });

          const stock = await tx.warehouseStock.findUnique({
            where: { warehouseId_itemId: { warehouseId: warehouse.id, itemId: line.itemId } },
          });
          if (stock) {
            await tx.warehouseStock.update({
              where: { id: stock.id },
              data: { qty: { increment: variance } },
            });
          } else if (variance > 0) {
            await tx.warehouseStock.create({
              data: { warehouseId: warehouse.id, itemId: line.itemId, qty: variance },
            });
          }

          await tx.item.update({
            where: { id: line.itemId },
            data: { stockQty: newQty },
          });
        }
      }

      if (submit) {
        await tx.physicalCountSession.update({
          where: { id: sessionId },
          data: { status: "SUBMITTED", submittedAt: new Date() },
        });
      }
    });

    if (submit) {
      const userId = await resolveUserId(actor ?? "INVENTORY_MANAGER");
      const fresh = await getOrCreateDraftSession(userId);
      return NextResponse.json({ ...mapSession(fresh), submitted: true });
    }

    const updated = await prisma.physicalCountSession.findUnique({
      where: { id: sessionId },
      include: { lines: { include: { item: { include: { warehouse: true } } } } },
    });
    return NextResponse.json(mapSession(updated!));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save worksheet";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
