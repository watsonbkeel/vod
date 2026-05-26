import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { jsonError, jsonOk, phoneSchema } from "@/lib/api";
import { signSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const verifySchema = z.object({
  phone: phoneSchema,
  code: z.string().trim().regex(/^\d{6}$/, "验证码格式不正确"),
});

export async function POST(request: Request) {
  const body = verifySchema.parse(await request.json());
  const smsCode = await prisma.smsCode.findFirst({
    where: {
      phone: body.phone,
      purpose: "login",
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!smsCode) {
    return jsonError("验证码不存在或已过期", 400);
  }

  const codeValid = await bcrypt.compare(body.code, smsCode.codeHash);

  if (!codeValid) {
    return jsonError("验证码不正确", 400);
  }

  const user = await prisma.user.upsert({
    where: { phone: body.phone },
    update: {},
    create: { phone: body.phone },
  });

  await prisma.smsCode.update({
    where: { id: smsCode.id },
    data: { usedAt: new Date(), userId: user.id },
  });

  const token = await signSession({ sub: user.id, role: "user" });
  const cookieStore = await cookies();
  cookieStore.set("vod_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return jsonOk({ userId: user.id });
}
