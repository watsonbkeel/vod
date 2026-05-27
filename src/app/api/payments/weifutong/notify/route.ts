import { prisma } from "@/lib/db";
import { ensurePurchaseEntitlement } from "@/lib/entitlements";
import { verifyWeifutongSignature } from "@/lib/payments/weifutong/sign";

function getPaidAt(payload: Record<string, string>) {
  const value = payload.time_end || payload.pay_time;
  if (!value) return new Date();

  const normalized = value.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6+08:00");
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]));
  const signatureValid = verifyWeifutongSignature(payload);
  const merchantOrderNo = payload.out_trade_no || payload.outTradeNo || payload.merchantOrderNo;

  await prisma.paymentCallbackLog.create({
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

  if (order.status !== "paid") {
    const paidAt = getPaidAt(payload);
    const expiresAt = new Date(paidAt.getTime() + order.course.validityDays * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "paid",
          thirdPartyOrderNo: payload.transaction_id || payload.trade_no || payload.thirdPartyOrderNo,
          paidAt,
        },
      });
      await ensurePurchaseEntitlement(tx, {
        userId: order.userId,
        courseId: order.courseId,
        startsAt: paidAt,
        expiresAt,
      });
      await tx.paymentCallbackLog.updateMany({
        where: { merchantOrderNo, signatureValid: true, processed: false },
        data: { processed: true },
      });
    });
  }

  return new Response("success");
}
