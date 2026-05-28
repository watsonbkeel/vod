import type { Prisma, PrismaClient } from "@prisma/client";

type EntitlementTx = PrismaClient | Prisma.TransactionClient;

export async function ensurePurchaseEntitlement(tx: EntitlementTx, input: { userId: string; courseId: string; startsAt: Date; expiresAt: Date }) {
  const existing = await tx.courseEntitlement.findFirst({
    where: {
      userId: input.userId,
      courseId: input.courseId,
      source: "purchase",
      status: "active",
    },
    orderBy: { expiresAt: "desc" },
  });
  const durationMs = input.expiresAt.getTime() - input.startsAt.getTime();

  if (existing && existing.expiresAt > input.startsAt) {
    return tx.courseEntitlement.update({
      where: { id: existing.id },
      data: { expiresAt: new Date(existing.expiresAt.getTime() + durationMs) },
    });
  }

  return tx.courseEntitlement.create({
    data: {
      userId: input.userId,
      courseId: input.courseId,
      source: "purchase",
      startsAt: input.startsAt,
      expiresAt: input.expiresAt,
    },
  });
}
