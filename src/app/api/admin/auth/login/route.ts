import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie } from "@/lib/auth/admin";
import { signSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const admin = await prisma.adminUser.findUnique({ where: { username } });

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    redirect("/admin/login?error=invalid");
  }

  const token = await signSession({ sub: admin.id, role: "admin" });
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}
