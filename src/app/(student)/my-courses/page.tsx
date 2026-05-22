import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { featuredCourses } from "@/lib/mock-data";

export default function MyCoursesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">我的课程</h1>
        <p className="mt-4 text-slate-600">这里会展示已购买或后台赠送的课程、到期时间和学习进度。</p>
        <div className="mt-8 grid gap-4">
          {featuredCourses.slice(0, 1).map((course) => (
            <div key={course.slug} className="flex flex-col justify-between gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{course.title}</h2>
                <p className="mt-2 text-sm text-slate-500">有效期至：购买后 365 天 · 最近学习：第 1 课</p>
              </div>
              <Link href="/learn/demo-course" className="rounded-full bg-slate-950 px-5 py-2 text-center text-sm font-medium text-white hover:bg-slate-800">
                继续学习
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
