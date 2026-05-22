import { cookies } from "next/headers";
import { jsonOk, phoneSchema } from "@/lib/api";
import { signSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = phoneSchema.parse(body.phone);

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
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
