"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

const courseFormSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  summary: z.string().trim().min(1),
  description: z.string().trim().min(1),
  priceYuan: z.coerce.number().min(0),
  validityDays: z.coerce.number().int().min(1),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]),
});

function parseCourseForm(formData: FormData) {
  const data = courseFormSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    priceYuan: formData.get("priceYuan"),
    validityDays: formData.get("validityDays"),
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status"),
  });

  return {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    description: data.description,
    priceCents: Math.round(data.priceYuan * 100),
    validityDays: data.validityDays,
    sortOrder: data.sortOrder,
    status: data.status,
  };
}

export async function createCourse(formData: FormData) {
  await requireAdminSession();
  const data = parseCourseForm(formData);
  const course = await prisma.course.create({ data });

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${course.id}/edit`);
}

export async function updateCourse(courseId: string, formData: FormData) {
  await requireAdminSession();
  const data = parseCourseForm(formData);
  const course = await prisma.course.update({ where: { id: courseId }, data });

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function deleteCourse(formData: FormData) {
  await requireAdminSession();
  const courseId = String(formData.get("courseId") ?? "");

  if (!courseId) return;

  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
}
