import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { closeExpiredOrder, getOrderExpiresAt } from "@/lib/orders";
import { ensurePurchaseEntitlement } from "@/lib/entitlements";
import { confirmWeifutongPaidPayload } from "@/lib/payments/weifutong/confirm";
import { queryWeifutongOrder } from "@/lib/payments/weifutong/query";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再查看订单", 401);
  }

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { course: { select: { id: true, title: true, slug: true, validityDays: true } } },
  });

  if (!order || order.userId !== userId) {
    return jsonError("订单不存在", 404);
  }

  let currentOrder = await closeExpiredOrder(order);

  if (currentOrder.status !== "paid" && currentOrder.merchantOrderNo) {
    try {
      const payment = await queryWeifutongOrder(currentOrder.merchantOrderNo);

      if (payment.signatureValid && payment.tradeState === "SUCCESS") {
        const confirmation = confirmWeifutongPaidPayload(payment.raw, {
          merchantOrderNo: currentOrder.merchantOrderNo,
          amountCents: currentOrder.amountCents,
          merchantId: process.env.WEIFUTONG_MCH_ID,
          currency: process.env.WEIFUTONG_CURRENCY,
        });

        if (!confirmation.ok) {
          currentOrder = await closeExpiredOrder(currentOrder);
        } else {
          const paidAt = confirmation.paidAt;
          const expiresAt = new Date(paidAt.getTime() + currentOrder.course.validityDays * 24 * 60 * 60 * 1000);

          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: currentOrder.id },
              data: {
                status: "paid",
                thirdPartyOrderNo: confirmation.transactionId,
                paidAt,
                closedAt: null,
              },
            });
            await ensurePurchaseEntitlement(tx, {
              userId: currentOrder.userId,
              courseId: currentOrder.courseId,
              startsAt: paidAt,
              expiresAt,
            });
          });

          currentOrder = { ...currentOrder, status: "paid", thirdPartyOrderNo: confirmation.transactionId, paidAt, closedAt: null };
        }
      }
    } catch {
      currentOrder = await closeExpiredOrder(currentOrder);
    }
  }

  return jsonOk({
    orderId: currentOrder.id,
    merchantOrderNo: currentOrder.merchantOrderNo,
    channel: currentOrder.channel,
    status: currentOrder.status,
    amountCents: currentOrder.amountCents,
    paidAt: currentOrder.paidAt,
    closedAt: currentOrder.closedAt,
    createdAt: currentOrder.createdAt,
    expiresAt: getOrderExpiresAt(currentOrder),
    paymentCodeUrl: currentOrder.paymentCodeUrl,
    paymentPayInfo: currentOrder.paymentPayInfo,
    course: currentOrder.course,
  });
}
