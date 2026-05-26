import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SiteHeader } from "@/components/site-header";
import { getPublishedCourseBySlug } from "@/lib/courses";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  await connection();
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-cyan-700">精品录播课程</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{course.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{course.description}</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">课程大纲</h2>
            <div className="mt-6 divide-y divide-slate-100">
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center gap-4 py-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-slate-950">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{lesson.summary ?? "付费后在有效期内观看完整视频。"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24">
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-cyan-800 p-6 text-white">
            <p className="text-sm text-cyan-100">课程价格</p>
            <p className="mt-2 text-4xl font-bold">{course.price}</p>
            <p className="mt-3 text-sm text-slate-200">购买后有效期 {course.validity}</p>
          </div>
          <dl className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <dt>课时数量</dt>
              <dd className="font-medium text-slate-950">{course.lessonCount} 个</dd>
            </div>
            <div className="flex justify-between">
              <dt>观看方式</dt>
              <dd className="font-medium text-slate-950">PC / 手机 H5</dd>
            </div>
            <div className="flex justify-between">
              <dt>试看</dt>
              <dd className="font-medium text-slate-950">不支持</dd>
            </div>
          </dl>
          <Link href="/login" className="mt-6 block rounded-full bg-orange-600 px-6 py-3 text-center font-semibold text-white hover:bg-orange-500">
            登录并购买
          </Link>
        </aside>
      </section>
    </main>
  );
}
