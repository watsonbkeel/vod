import type { Course, Lesson } from "@prisma/client";
import { prisma } from "@/lib/db";
import { playableLessonWhere } from "@/lib/lessons/playable";
import { formatMoney } from "@/lib/money";

export type CourseListItem = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  summary: string;
  description: string;
  priceCents: number;
  regularPriceCents: number;
  promoLabel: string;
  price: string;
  validity: string;
  validityDays: number;
  lessonCount: number;
};

export type CourseDetail = CourseListItem & {
  lessons: Array<Pick<Lesson, "id" | "title" | "summary" | "sortOrder" | "durationSec">>;
};

export function formatPrice(priceCents: number) {
  return formatMoney(priceCents);
}

export function formatValidity(validityDays: number) {
  return validityDays >= 365 && validityDays % 365 === 0 ? `${validityDays / 365} 年` : `${validityDays} 天`;
}

function toCourseListItem(course: Course & { _count: { lessons: number } }): CourseListItem {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    coverUrl: course.coverUrl,
    summary: course.summary,
    description: course.description,
    priceCents: course.priceCents,
    regularPriceCents: course.regularPriceCents,
    promoLabel: course.promoLabel,
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
    include: { _count: { select: { lessons: { where: playableLessonWhere() } } } },
  });

  return courses.map(toCourseListItem);
}

export async function getPublishedCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const course = await prisma.course.findFirst({
    where: { slug, status: "published" },
    include: {
      lessons: {
        where: playableLessonWhere(),
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, summary: true, sortOrder: true, durationSec: true },
      },
      _count: { select: { lessons: { where: playableLessonWhere() } } },
    },
  });

  if (!course) return null;

  return {
    ...toCourseListItem(course),
    lessons: course.lessons,
  };
}
