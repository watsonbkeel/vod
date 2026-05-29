import { connection } from "next/server";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { getPublishedCourses } from "@/lib/courses";
import { MAIN_COURSE } from "@/lib/site-content";

export default async function CoursesPage() {
  await connection();
  const courses = await getPublishedCourses();
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-700">课程中心</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">用AI做真实小程序，培养面向未来的创造力</h1>
          <p className="mt-4 leading-7 text-slate-600">
            这里的课程围绕真实产品项目设计，适合9-15岁孩子在家长支持下学习。每门课都回答三个问题：孩子要做出什么作品，过程中学会哪些能力，最后如何展示和复盘。
          </p>
        </div>
        <div className="mt-8 grid gap-4 rounded-3xl bg-slate-950 p-6 text-white md:grid-cols-3">
          <div>
            <p className="text-sm text-emerald-200">当前主推</p>
            <h2 className="mt-2 text-2xl font-semibold">{MAIN_COURSE.listTitle}</h2>
          </div>
          <p className="text-sm leading-6 text-slate-300">早鸟价 {MAIN_COURSE.earlyBirdPriceCents / 100} 元，正价 {MAIN_COURSE.regularPriceCents / 100} 元。购买后 {MAIN_COURSE.validityDays} 天内可反复观看。</p>
          <p className="text-sm leading-6 text-slate-300">{MAIN_COURSE.serviceModel}。直播答疑用于解答问题和补充进阶技巧，具体安排以购买后通知为准。</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
