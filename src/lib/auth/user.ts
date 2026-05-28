import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth/session";

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vod_session")?.value;

  if (!token) return null;

  try {
    const session = await verifySession(token);
    if (session.role !== "user") return null;

    const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { status: true } });

    return user?.status === "active" ? session : null;
  } catch {
    return null;
  }
}

export async function getUserId() {
  const session = await getUserSession();
  return session?.sub ?? null;
}
