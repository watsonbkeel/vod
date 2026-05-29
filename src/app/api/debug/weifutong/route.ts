import { jsonError, jsonOk } from "@/lib/api";
import { getUserId } from "@/lib/auth/user";
import { createWeifutongOrder } from "@/lib/payments/weifutong/order";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return jsonError("仅本地调试可用", 404);
  }

  const userId = await getUserId();

  if (!userId) {
    return jsonError("请先登录后再调试支付", 401);
  }

  const { service } = await request.json().catch(() => ({ service: "" }));
  const previous = process.env.WEIFUTONG_ALIPAY_SERVICE;

  try {
    if (typeof service === "string" && service) {
      process.env.WEIFUTONG_ALIPAY_SERVICE = service;
    }

    const payment = await createWeifutongOrder({
      channel: "alipay",
      merchantOrderNo: `DEBUG${Date.now()}`,
      body: "VOD支付调试",
      amountCents: 1,
      notifyUrl: process.env.WEIFUTONG_NOTIFY_URL || `${process.env.APP_URL ?? "http://localhost:3000"}/api/payments/weifutong/notify`,
      callbackUrl: `${process.env.APP_URL ?? "http://localhost:3000"}/courses`,
      clientIp: "127.0.0.1",
    });

    return jsonOk({ service, codeUrl: payment.codeUrl, payInfo: payment.payInfo, raw: payment.raw });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "支付调试失败", 400);
  } finally {
    process.env.WEIFUTONG_ALIPAY_SERVICE = previous;
  }
}
