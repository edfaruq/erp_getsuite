import { prisma } from "./prisma";
import { ALL_ROLES, AppRole } from "@/constants/roles";

const ROLE_SET = new Set<string>(ALL_ROLES);

export async function resolveUserId(actor?: string): Promise<string> {
  if (actor && ROLE_SET.has(actor)) {
    const user = await prisma.user.findFirst({ where: { role: actor as AppRole } });
    if (user) return user.id;
  }

  if (actor) {
    const user = await prisma.user.findUnique({ where: { id: actor } });
    if (user) return user.id;
  }

  const fallback = await prisma.user.findFirst({ orderBy: { email: "asc" } });
  if (!fallback) throw new Error("No users in database — run prisma db seed");
  return fallback.id;
}
