import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api";
import { verifySession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const orderSchema = z.object({
  courseId: z.string().trim().min(1),
  channel: z.enum(["wechat", "alipay"]).default("wechat"),
});

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vod_session")?.value;

  if (!token) return null;

  try {
    const session = await verifySession(token);
    return session.role === "user" ? session.sub : null;
  } catch {
    return null;
  }
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

  return jsonOk({
    orderId: order.id,
    merchantOrderNo: order.merchantOrderNo,
    channel: order.channel,
    amountCents: order.amountCents,
    status: order.status,
    payment: {
      mode: process.env.WEIFUTONG_GATEWAY_URL ? "weifutong" : "mock",
    },
  });
}
