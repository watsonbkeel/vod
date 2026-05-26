import { jsonError, jsonOk, phoneSchema } from "@/lib/api";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  await requireAdminSession();
  const body = await request.json();
  const phone = phoneSchema.parse(body.phone);
  const courseId = String(body.courseId ?? "");
  const validityDays = Number(body.validityDays ?? 365);
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course || !Number.isInteger(validityDays) || validityDays < 1) {
    return jsonError("课程或有效期无效", 400);
  }

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });
  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + validityDays * 24 * 60 * 60 * 1000);
  const entitlement = await prisma.courseEntitlement.create({
    data: {
      userId: user.id,
      courseId: course.id,
      source: "admin",
      startsAt,
      expiresAt,
    },
  });

  return jsonOk({
    userId: user.id,
    courseId: course.id,
    entitlementId: entitlement.id,
    expiresAt,
  });
}
