import Link from "next/link";

export type CourseCardData = {
  title: string;
  slug: string;
  summary: string;
  price: string;
  validity: string;
  lessonCount: number;
};

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-800 px-8 text-center text-2xl font-semibold text-white">
        {course.title}
      </div>
      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{course.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{course.summary}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{course.lessonCount} 个课时</span>
          <span>有效期 {course.validity}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-orange-600">{course.price}</span>
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
