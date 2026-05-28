import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { jsonError, jsonOk, phoneSchema } from "@/lib/api";
import { signSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/urls";

const passwordAuthSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(6, "密码至少需要 6 位"),
});

async function setUserSession(userId: string) {
  const token = await signSession({ sub: userId, role: "user" });
  const cookieStore = await cookies();
  cookieStore.set("vod_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function authenticateWithPassword(input: { phone: string; password: string }) {
  const existingUser = await prisma.user.findUnique({ where: { phone: input.phone } });

  if (existingUser && existingUser.status !== "active") {
    throw new Error("账号已被禁用");
  }

  if (existingUser?.passwordHash) {
    const passwordValid = await bcrypt.compare(input.password, existingUser.passwordHash);

    if (!passwordValid) {
      throw new Error("手机号或密码不正确");
    }

    await setUserSession(existingUser.id);
    return { userId: existingUser.id, mode: "login" as const };
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = existingUser
    ? await prisma.user.update({ where: { id: existingUser.id }, data: { passwordHash } })
    : await prisma.user.create({ data: { phone: input.phone, passwordHash } });

  await setUserSession(user.id);
  return { userId: user.id, mode: "register" as const };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const formMode = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
  const rawBody = formMode ? Object.fromEntries(await request.formData()) : await request.json();
  const body = passwordAuthSchema.parse(rawBody);

  try {
    const result = await authenticateWithPassword(body);

    if (formMode) {
      return NextResponse.redirect(getAppUrl("/my-courses", request), 303);
    }

    return jsonOk(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "登录失败";

    if (formMode) {
      const url = getAppUrl("/login", request);
      url.searchParams.set("error", message);
      return NextResponse.redirect(url, 303);
    }

    return jsonError(message, message === "账号已被禁用" ? 403 : 400);
  }
}
