import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { ensurePurchaseEntitlement } from "@/lib/entitlements";

export async function POST(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再完成支付", 401);
  }

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { course: true },
  });

  if (!order || order.userId !== userId) {
    return jsonError("订单不存在", 404);
  }

  if (order.status === "paid") {
    return jsonOk({ orderId: order.id, status: order.status, paidAt: order.paidAt });
  }

  if (order.status !== "pending") {
    return jsonError("订单当前状态不能支付", 400);
  }

  const paidAt = new Date();
  const expiresAt = new Date(paidAt.getTime() + order.course.validityDays * 24 * 60 * 60 * 1000);

  const paidOrder = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        thirdPartyOrderNo: `MOCK-${order.merchantOrderNo}`,
        paidAt,
      },
    });

    await ensurePurchaseEntitlement(tx, {
      userId: order.userId,
      courseId: order.courseId,
      startsAt: paidAt,
      expiresAt,
    });

    return updatedOrder;
  });

  return jsonOk({ orderId: paidOrder.id, status: paidOrder.status, paidAt: paidOrder.paidAt });
}
