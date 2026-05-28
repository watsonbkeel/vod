import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { SiteHeader } from "@/components/site-header";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { playableLessonWhere } from "@/lib/lessons/playable";

export default async function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const { courseId } = await params;
  const entitlement = await prisma.courseEntitlement.findFirst({
    where: {
      userId,
      courseId,
      status: "active",
      startsAt: { lte: new Date() },
      expiresAt: { gt: new Date() },
    },
  });

  if (!entitlement) {
    notFound();
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, status: "published" },
    include: {
      lessons: {
        where: playableLessonWhere(),
        orderBy: { sortOrder: "asc" },
        include: {
          lessonProgress: { where: { userId }, take: 1 },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <LessonPlayer
        courseTitle={course.title}
        lessons={course.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          sortOrder: lesson.sortOrder,
          positionSec: lesson.lessonProgress[0]?.positionSec ?? 0,
          completed: lesson.lessonProgress[0]?.completed ?? false,
        }))}
      />
    </main>
  );
}
