import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { closeExpiredOrder, getOrderExpiresAt } from "@/lib/orders";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再查看订单", 401);
  }

  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.userId !== userId) {
    return jsonError("订单不存在", 404);
  }

  const currentOrder = await closeExpiredOrder(order);

  if (currentOrder.status !== "pending") {
    return jsonOk({
      status: currentOrder.status,
      closedAt: currentOrder.closedAt,
      expiresAt: getOrderExpiresAt(currentOrder),
      qrContent: null,
      fallbackUrl: null,
    });
  }

  const paymentUrl = currentOrder.paymentCodeUrl || currentOrder.paymentPayInfo || "";

  if (!paymentUrl) {
    return jsonError("订单暂无可用支付链接", 404);
  }

  return jsonOk({
    status: currentOrder.status,
    closedAt: currentOrder.closedAt,
    expiresAt: getOrderExpiresAt(currentOrder),
    qrContent: paymentUrl,
    fallbackUrl: paymentUrl,
  });
}
