import { AdminShell } from "@/components/admin-shell";
import { featuredCourses } from "@/lib/mock-data";

export default function AdminCoursesPage() {
  return (
    <AdminShell title="课程管理">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">管理课程、课时、价格、有效期与视频资源。</p>
          <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">新建课程</button>
        </div>
        <div className="mt-6 divide-y divide-slate-100">
          {featuredCourses.map((course) => (
            <div key={course.slug} className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-medium text-slate-950">{course.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{course.lessonCount} 课时 · {course.price} · {course.validity}</p>
              </div>
              <button className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600">编辑</button>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
