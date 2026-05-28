import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { canUseWeifutong, createWeifutongOrder } from "@/lib/payments/weifutong/order";

const orderSchema = z.object({
  courseId: z.string().trim().min(1),
  channel: z.enum(["wechat", "alipay"]).default("wechat"),
});

function getNotifyUrl() {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  return process.env.WEIFUTONG_NOTIFY_URL || `${appUrl}/api/payments/weifutong/notify`;
}

function getCallbackUrl(orderId: string) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  return `${appUrl}/orders/${orderId}`;
}

function getClientIp(headersList: Headers) {
  return headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "127.0.0.1";
}

export async function POST(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再购买课程", 401);
  }

  const body = orderSchema.parse(await request.json());
  const course = await prisma.course.findUnique({ where: { id: body.courseId } });

  if (!course || course.status !== "published") {
    return jsonError("课程不存在或未上架", 404);
  }

  const order = await prisma.order.create({
    data: {
      userId,
      courseId: course.id,
      merchantOrderNo: `VOD${Date.now()}${nanoid(6)}`,
      channel: body.channel,
      amountCents: course.priceCents,
      status: "pending",
    },
  });
  const headersList = await headers();
  let payment: Awaited<ReturnType<typeof createWeifutongOrder>> | { mode: "mock" };

  try {
    payment = canUseWeifutong()
      ? await createWeifutongOrder({
          channel: body.channel,
          merchantOrderNo: order.merchantOrderNo,
          body: course.title,
          amountCents: order.amountCents,
          notifyUrl: getNotifyUrl(),
          callbackUrl: getCallbackUrl(order.id),
          clientIp: getClientIp(headersList),
        })
      : { mode: "mock" as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "创建支付订单失败";

    if (message.includes("has not opened") || message.includes("payment type")) {
      return jsonError("当前威富通商户未开通所选支付产品，请先在威富通后台开通，或配置 WEIFUTONG_WECHAT_SERVICE/WEIFUTONG_ALIPAY_SERVICE 为商户已开通的 service。", 400);
    }

    return jsonError(message, 502);
  }

  if (payment.mode === "weifutong") {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentCodeUrl: payment.codeUrl,
        paymentPayInfo: payment.payInfo,
      },
    });
  }

  return jsonOk({
    orderId: order.id,
    merchantOrderNo: order.merchantOrderNo,
    channel: order.channel,
    amountCents: order.amountCents,
    status: order.status,
    payment,
  });
}
