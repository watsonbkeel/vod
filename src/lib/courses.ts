import type { Course, Lesson } from "@prisma/client";
import { prisma } from "@/lib/db";

export type CourseListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  price: string;
  validity: string;
  validityDays: number;
  lessonCount: number;
};

export type CourseDetail = CourseListItem & {
  lessons: Array<Pick<Lesson, "id" | "title" | "summary" | "sortOrder" | "durationSec">>;
};

export function formatPrice(priceCents: number) {
  return `¥${(priceCents / 100).toLocaleString("zh-CN", {
    minimumFractionDigits: Number.isInteger(priceCents / 100) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatValidity(validityDays: number) {
  return validityDays >= 365 && validityDays % 365 === 0 ? `${validityDays / 365} 年` : `${validityDays} 天`;
}

function toCourseListItem(course: Course & { _count: { lessons: number } }): CourseListItem {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    summary: course.summary,
    description: course.description,
    price: formatPrice(course.priceCents),
    validity: formatValidity(course.validityDays),
    validityDays: course.validityDays,
    lessonCount: course._count.lessons,
  };
}

export async function getPublishedCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "published" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { lessons: true } } },
  });

  return courses.map(toCourseListItem);
}

export async function getPublishedCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const course = await prisma.course.findFirst({
    where: { slug, status: "published" },
    include: {
      lessons: {
        where: { status: "published" },
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, summary: true, sortOrder: true, durationSec: true },
      },
      _count: { select: { lessons: true } },
    },
  });

  if (!course) return null;

  return {
    ...toCourseListItem(course),
    lessons: course.lessons,
  };
}
