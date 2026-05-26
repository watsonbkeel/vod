import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie } from "@/lib/auth/admin";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookie);
  redirect("/admin/login");
}
