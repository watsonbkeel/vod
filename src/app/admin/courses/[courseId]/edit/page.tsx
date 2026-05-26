import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { CourseForm } from "@/components/course-form";
import { LessonForm } from "@/components/lesson-form";
import { prisma } from "@/lib/db";
import { createLesson, deleteLesson, updateCourse, updateLesson } from "../../actions";

type EditCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
  });

  if (!course) {
    notFound();
  }

  return (
    <AdminShell title="编辑课程">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <CourseForm action={updateCourse.bind(null, course.id)} course={course} submitLabel="保存课程" />
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">课时列表</h3>
                <p className="mt-1 text-sm text-slate-500">管理这门课程下的课时、排序和上下架状态。</p>
              </div>
              <Link href="/admin/courses" className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-slate-950 hover:text-slate-950">
                返回课程
              </Link>
            </div>
            <div className="mt-6 divide-y divide-slate-100">
              {course.lessons.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">暂无课时，先从右侧创建一个。</div>
              ) : (
                course.lessons.map((lesson) => (
                  <div key={lesson.id} className="grid gap-4 py-5">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">#{lesson.sortOrder}</span>
                          <h4 className="font-medium text-slate-950">{lesson.title}</h4>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{lesson.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{lesson.summary || "暂无简介"}</p>
                      </div>
                      <form action={deleteLesson.bind(null, course.id, lesson.id)}>
                        <button className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:border-red-500">删除</button>
                      </form>
                    </div>
                    <LessonForm action={updateLesson.bind(null, course.id, lesson.id)} lesson={lesson} submitLabel="保存课时" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-950">新建课时</h3>
          <LessonForm action={createLesson.bind(null, course.id)} submitLabel="创建课时" />
        </div>
      </div>
    </AdminShell>
  );
}
