import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";

export default async function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        where: { status: "published" },
        orderBy: { sortOrder: "asc" },
        include: {
          lessonProgress: { where: { userId: { not: "" } }, orderBy: { updatedAt: "desc" }, take: 1 },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const firstLesson = course.lessons[0];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10">
          <div className="flex aspect-video items-center justify-center bg-slate-900 text-slate-400">
            MP4 播放器区域：正式接口会在鉴权后返回短期 COS 播放 URL
          </div>
          <div className="border-t border-white/10 p-6">
            <p className="text-sm text-cyan-300">{firstLesson ? `第 ${firstLesson.sortOrder} 课` : "暂无课时"}</p>
            <h1 className="mt-2 text-2xl font-semibold">{firstLesson?.title ?? course.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">播放器会定期上报学习进度，后台可查看每位学员的观看情况。</p>
          </div>
        </div>
        <aside className="rounded-3xl bg-white p-5 text-slate-950 shadow-xl">
          <h2 className="text-lg font-semibold">课时目录</h2>
          <div className="mt-4 space-y-2">
            {course.lessons.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">暂无已上架课时</p>
            ) : (
              course.lessons.map((lesson, index) => (
                <button key={lesson.id} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left text-sm hover:bg-slate-50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600">{index + 1}</span>
                  <span>{lesson.title}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {lesson.lessonProgress[0] ? `已学 ${lesson.lessonProgress[0].positionSec}s` : "未学习"}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
