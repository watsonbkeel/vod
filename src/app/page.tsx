import Link from "next/link";
import { connection } from "next/server";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { getPublishedCourses } from "@/lib/courses";
import { prisma } from "@/lib/db";

export default async function Home() {
  await connection();
  const [courses, homeContent] = await Promise.all([
    getPublishedCourses(),
    prisma.siteContent.findUnique({ where: { key: "home" } }),
  ]);
  const featuredCourse = courses[0];
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <span className="mb-5 w-fit rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 ring-1 ring-cyan-100">
            个人品牌课程 · 系统化付费学习
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            {homeContent?.title ?? "把复杂方法讲清楚，把学习结果真正落到行动里"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {homeContent?.content ?? "面向希望系统提升的学员，提供结构化视频课程、课时目录、有效期权益和学习进度记录。你可以先了解课程体系，再进入 H5 学习页持续复盘。"}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="rounded-full bg-slate-950 px-6 py-3 text-center font-medium text-white hover:bg-slate-800">
              查看课程
            </Link>
            <Link href="/about" className="rounded-full border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 hover:border-slate-950 hover:text-slate-950">
              了解讲师
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["系统课程", "从概念、案例到实操路径，按课时推进学习。"],
              ["有效期权益", "购买或赠课后按课程有效期开放学习入口。"],
              ["进度记录", "记录观看位置和完成状态，方便后续复盘。"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 to-cyan-800 p-8 text-white">
            <p className="text-sm text-cyan-100">主推课程</p>
            <h2 className="mt-4 text-3xl font-semibold">{featuredCourse?.title ?? "系统实战训练营"}</h2>
            <p className="mt-4 leading-7 text-slate-200">
              {featuredCourse?.summary ?? "8 个核心课时，一次购买，一年有效。适合希望系统掌握方法并完成实操闭环的学员。"}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl bg-white/10 p-4">
                <strong className="block text-2xl">{featuredCourse?.lessonCount ?? 8}</strong>课时
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <strong className="block text-2xl">365</strong>天有效
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <strong className="block text-2xl">H5</strong>在线学
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 rounded-3xl bg-slate-950 p-6 text-white md:grid-cols-3 md:p-8">
          <div>
            <p className="text-sm text-cyan-200">适合谁</p>
            <h2 className="mt-2 text-2xl font-semibold">想把知识转化为可执行方案的人</h2>
          </div>
          <p className="text-sm leading-6 text-slate-300">适合希望按清晰路径学习、练习和复盘的学员，而不是只收藏碎片化资料。</p>
          <p className="text-sm leading-6 text-slate-300">课程以视频点播为主，后续可扩展作业、调研和学习反馈，形成完整教学闭环。</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-700">课程体系</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">精选课程</h2>
          </div>
          <Link href="/courses" className="text-sm font-medium text-slate-600 hover:text-slate-950">
            全部课程 →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
