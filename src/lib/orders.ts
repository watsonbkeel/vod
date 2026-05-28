import type { Order } from "@prisma/client";
import { prisma } from "@/lib/db";

export const ORDER_PAYMENT_WINDOW_MS = 10 * 60 * 1000;

export function getOrderExpiresAt(order: Pick<Order, "createdAt">) {
  return new Date(order.createdAt.getTime() + ORDER_PAYMENT_WINDOW_MS);
}

export function isOrderExpired(order: Pick<Order, "createdAt">, now = new Date()) {
  return getOrderExpiresAt(order).getTime() <= now.getTime();
}

export async function closeExpiredOrder<T extends Pick<Order, "id" | "status" | "createdAt" | "closedAt">>(order: T, now = new Date()) {
  if (order.status !== "pending" || !isOrderExpired(order, now)) {
    return order;
  }

  const closedOrder = await prisma.order.update({
    where: { id: order.id, status: "pending" },
    data: { status: "closed", closedAt: now },
    select: { status: true, closedAt: true },
  });

  return {
    ...order,
    status: closedOrder.status,
    closedAt: closedOrder.closedAt,
  };
}
