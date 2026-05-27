import type { Prisma, PrismaClient } from "@prisma/client";

type EntitlementTx = PrismaClient | Prisma.TransactionClient;

export async function ensurePurchaseEntitlement(tx: EntitlementTx, input: { userId: string; courseId: string; startsAt: Date; expiresAt: Date }) {
  const existing = await tx.courseEntitlement.findFirst({
    where: {
      userId: input.userId,
      courseId: input.courseId,
      source: "purchase",
      startsAt: input.startsAt,
    },
  });

  if (existing) return existing;

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
