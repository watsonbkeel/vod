import { prisma } from "@/lib/db";
import { ensurePurchaseEntitlement } from "@/lib/entitlements";
import { confirmWeifutongPaidPayload } from "@/lib/payments/weifutong/confirm";
import { parseWeifutongNotificationPayload } from "@/lib/payments/weifutong/notify";
import { verifyWeifutongSignature } from "@/lib/payments/weifutong/sign";

export async function POST(request: Request) {
  const payload = await parseWeifutongNotificationPayload(request);
  const signatureValid = verifyWeifutongSignature(payload);
  const merchantOrderNo = payload.out_trade_no || payload.outTradeNo || payload.merchantOrderNo;

  const callbackLog = await prisma.paymentCallbackLog.create({
    data: {
      merchantOrderNo,
      channel: payload.trade_type || payload.channel,
      rawPayload: payload,
      signatureValid,
    },
  });

  if (!signatureValid || !merchantOrderNo) {
    return new Response("fail", { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { merchantOrderNo },
    include: { course: true },
  });

  if (!order) {
    return new Response("fail", { status: 404 });
  }

  const confirmation = confirmWeifutongPaidPayload(payload, {
    merchantOrderNo,
    amountCents: order.amountCents,
    merchantId: process.env.WEIFUTONG_MCH_ID,
    currency: process.env.WEIFUTONG_CURRENCY,
  });

  if (!confirmation.ok) {
    await prisma.paymentCallbackLog.update({
      where: { id: callbackLog.id },
      data: { errorMessage: confirmation.error },
    });
    return new Response("fail", { status: 400 });
  }

  if (order.status !== "paid") {
    const paidAt = confirmation.paidAt;
    const expiresAt = new Date(paidAt.getTime() + order.course.validityDays * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "paid",
          thirdPartyOrderNo: confirmation.transactionId,
          paidAt,
        },
      });
      await ensurePurchaseEntitlement(tx, {
        userId: order.userId,
        courseId: order.courseId,
        startsAt: paidAt,
        expiresAt,
      });
      await tx.paymentCallbackLog.update({
        where: { id: callbackLog.id },
        data: { processed: true, errorMessage: null },
      });
    });
  } else {
    await prisma.paymentCallbackLog.update({
      where: { id: callbackLog.id },
      data: { processed: true, errorMessage: null },
    });
  }

  return new Response("success");
}
