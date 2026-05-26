import Link from "next/link";
import { connection } from "next/server";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { getPublishedCourses } from "@/lib/courses";

export default async function Home() {
  await connection();
  const courses = await getPublishedCourses();
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
            把高价值经验沉淀成可反复学习的视频课程
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            这里展示你的专业定位、课程体系和代表成果。学员购买后可在有效期内在线观看视频，持续记录学习进度。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="rounded-full bg-slate-950 px-6 py-3 text-center font-medium text-white hover:bg-slate-800">
              查看课程
            </Link>
            <Link href="/about" className="rounded-full border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 hover:border-slate-950 hover:text-slate-950">
              了解讲师
            </Link>
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
