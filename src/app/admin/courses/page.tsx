import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/auth/admin";
import { CourseForm } from "@/components/course-form";
import { formatPrice, formatValidity } from "@/lib/courses";
import { prisma } from "@/lib/db";
import { createCourse, deleteCourse } from "./actions";

export default async function AdminCoursesPage() {
  await requireAdminSession();

  const courses = await prisma.course.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { lessons: true } } },
  });

  return (
    <AdminShell title="课程管理">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">管理课程、价格、有效期、上下架状态和排序。</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{courses.length} 门课程</span>
          </div>
          <div className="mt-6 divide-y divide-slate-100">
            {courses.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">暂无课程，先从右侧创建一门。</div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-950">{course.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{course.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {course._count.lessons} 课时 · {formatPrice(course.priceCents)} · 有效期 {formatValidity(course.validityDays)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/courses/${course.id}/edit`} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-slate-950 hover:text-slate-950">
                      编辑课程/课时
                    </Link>
                    <form action={deleteCourse}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <button className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:border-red-500">删除</button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-950">新建课程</h3>
          <CourseForm action={createCourse} submitLabel="创建课程" />
        </div>
      </div>
    </AdminShell>
  );
}
