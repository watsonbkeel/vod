import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再查看订单", 401);
  }

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { course: { select: { id: true, title: true, slug: true } } },
  });

  if (!order || order.userId !== userId) {
    return jsonError("订单不存在", 404);
  }

  return jsonOk({
    orderId: order.id,
    merchantOrderNo: order.merchantOrderNo,
    channel: order.channel,
    status: order.status,
    amountCents: order.amountCents,
    paidAt: order.paidAt,
    course: order.course,
  });
}
