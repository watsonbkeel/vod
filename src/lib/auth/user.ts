import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/session";

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vod_session")?.value;

  if (!token) return null;

  try {
    const session = await verifySession(token);
    return session.role === "user" ? session : null;
  } catch {
    return null;
  }
}

export async function getUserId() {
  const session = await getUserSession();
  return session?.sub ?? null;
}
