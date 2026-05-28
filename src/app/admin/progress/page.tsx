import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default async function AdminProgressPage() {
  await requireAdminSession();

  const progressRecords = await prisma.lessonProgress.findMany({
    orderBy: { lastWatchedAt: "desc" },
    include: {
      user: { select: { phone: true } },
      course: { select: { title: true } },
      lesson: { select: { title: true } },
    },
    take: 200,
  });

  const completedCount = progressRecords.filter((progress) => progress.completed).length;

  return (
    <AdminShell title="学习进度">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">进度记录</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{progressRecords.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">已完成课时</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{completedCount}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">最近记录</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">最近 {Math.min(progressRecords.length, 200)} 条</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">查看学员观看到哪个课时、当前位置、是否完成以及最后学习时间。</p>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{progressRecords.length} 条记录</span>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
          {progressRecords.length === 0 ? (
            <div className="bg-slate-50 p-8 text-center text-slate-500">暂无学习进度</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">用户</th>
                    <th className="px-4 py-3 font-medium">课程</th>
                    <th className="px-4 py-3 font-medium">课时</th>
                    <th className="px-4 py-3 font-medium">位置</th>
                    <th className="px-4 py-3 font-medium">状态</th>
                    <th className="px-4 py-3 font-medium">最后学习</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  {progressRecords.map((progress) => (
                    <tr key={progress.id}>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-950">{progress.user.phone}</td>
                      <td className="min-w-48 px-4 py-4">{progress.course.title}</td>
                      <td className="min-w-48 px-4 py-4">{progress.lesson.title}</td>
                      <td className="whitespace-nowrap px-4 py-4">{formatDuration(progress.positionSec)}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs ${progress.completed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {progress.completed ? "已完成" : "学习中"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">{progress.lastWatchedAt.toLocaleString("zh-CN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
