import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { featuredCourses } from "@/lib/mock-data";

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-cyan-700">课程中心</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">选择适合你的系统课程</h1>
          <p className="mt-4 leading-7 text-slate-600">
            第一版支持一门课一次性购买，多课时视频在线播放，课程有效期通常为一年。后续可继续扩展更多课程。
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featuredCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
