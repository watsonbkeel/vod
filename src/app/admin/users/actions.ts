"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { phoneSchema } from "@/lib/api";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

const grantSchema = z.object({
  phone: phoneSchema,
  courseId: z.string().trim().min(1),
  validityDays: z.coerce.number().int().min(1),
});

export async function grantCourse(formData: FormData) {
  await requireAdminSession();
  const data = grantSchema.parse({
    phone: formData.get("phone"),
    courseId: formData.get("courseId"),
    validityDays: formData.get("validityDays") || 365,
  });

  const course = await prisma.course.findUnique({ where: { id: data.courseId } });
  if (!course) return;

  const user = await prisma.user.upsert({
    where: { phone: data.phone },
    update: {},
    create: { phone: data.phone },
  });
  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + data.validityDays * 24 * 60 * 60 * 1000);

  await prisma.courseEntitlement.create({
    data: {
      userId: user.id,
      courseId: course.id,
      source: "admin",
      startsAt,
      expiresAt,
    },
  });

  revalidatePath("/admin/users");
}
