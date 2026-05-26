import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { CourseForm } from "@/components/course-form";
import { prisma } from "@/lib/db";
import { updateCourse } from "../../actions";

type EditCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    notFound();
  }

  return (
    <AdminShell title="编辑课程">
      <CourseForm action={updateCourse.bind(null, course.id)} course={course} submitLabel="保存课程" />
    </AdminShell>
  );
}
