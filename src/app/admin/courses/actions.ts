"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { bindUploadedMediaToLesson } from "@/lib/admin/media-binding";
import { prisma } from "@/lib/db";

const courseFormSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  coverUrl: z.string().trim().optional(),
  summary: z.string().trim().min(1),
  description: z.string().trim().min(1),
  regularPriceYuan: z.coerce.number().min(0),
  promoLabel: z.string().trim().min(1),
  priceYuan: z.coerce.number().min(0),
  validityDays: z.coerce.number().int().min(1),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]),
});

const lessonFormSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "hidden"]),
  durationSec: z.preprocess((value) => (value === "" ? null : value), z.coerce.number().int().min(0).nullable()),
});

const mediaBindingSchema = z.object({
  lessonId: z.string().trim().min(1),
  mediaAssetId: z.string().trim().min(1),
});

function parseCourseForm(formData: FormData) {
  const data = courseFormSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    coverUrl: formData.get("coverUrl"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    regularPriceYuan: formData.get("regularPriceYuan"),
    promoLabel: formData.get("promoLabel"),
    priceYuan: formData.get("priceYuan"),
    validityDays: formData.get("validityDays"),
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status"),
  });

  return {
    title: data.title,
    slug: data.slug,
    coverUrl: data.coverUrl || null,
    summary: data.summary,
    description: data.description,
    regularPriceCents: Math.round(data.regularPriceYuan * 100),
    promoLabel: data.promoLabel,
    priceCents: Math.round(data.priceYuan * 100),
    validityDays: data.validityDays,
    sortOrder: data.sortOrder,
    status: data.status,
  };
}

function parseLessonForm(formData: FormData) {
  const data = lessonFormSchema.parse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    sortOrder: formData.get("sortOrder") || 0,
    status: formData.get("status"),
    durationSec: formData.get("durationSec"),
  });

  return {
    title: data.title,
    summary: data.summary || null,
    sortOrder: data.sortOrder,
    status: data.status,
    durationSec: data.durationSec,
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

export async function createLesson(courseId: string, formData: FormData) {
  await requireAdminSession();
  const data = parseLessonForm(formData);
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } });

  if (!course) return;

  await prisma.lesson.create({ data: { ...data, courseId } });
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);
}

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
  await requireAdminSession();
  const data = parseLessonForm(formData);
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } });

  if (!course) return;

  await prisma.lesson.update({ where: { id: lessonId, courseId }, data });
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await requireAdminSession();
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } });

  if (!course) return;

  await prisma.lesson.delete({ where: { id: lessonId, courseId } });
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);
}

export async function bindLessonMedia(courseId: string, formData: FormData) {
  await requireAdminSession();
  const data = mediaBindingSchema.parse({
    lessonId: formData.get("lessonId"),
    mediaAssetId: formData.get("mediaAssetId"),
  });

  const result = await bindUploadedMediaToLesson({
    courseId,
    lessonId: data.lessonId,
    mediaAssetId: data.mediaAssetId,
  });

  revalidatePath(`/courses/${result.course.slug}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);
}
