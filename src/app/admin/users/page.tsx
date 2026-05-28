import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import { grantCourse } from "./actions";

export default async function AdminUsersPage() {
  await requireAdminSession();

  const [users, courses] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        entitlements: {
          orderBy: { expiresAt: "desc" },
          include: { course: { select: { title: true } } },
        },
      },
    }),
    prisma.course.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);

  return (
    <AdminShell title="用户与赠课">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">查看用户手机号、注册时间、已购/赠课权益和到期时间。</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{users.length} 个用户</span>
          </div>
          <div className="mt-6 divide-y divide-slate-100">
            {users.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">暂无用户</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="py-4">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <h3 className="font-medium text-slate-950">{user.phone}</h3>
                      <p className="mt-1 text-sm text-slate-500">注册于 {user.createdAt.toLocaleDateString("zh-CN")}</p>
                    </div>
                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{user.status}</span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {user.entitlements.length === 0 ? (
                      <p className="text-sm text-slate-400">暂无课程权益</p>
                    ) : (
                      user.entitlements.map((entitlement) => (
                        <div key={entitlement.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          {entitlement.course.title} · {entitlement.source} · {entitlement.status} · 到期 {entitlement.expiresAt.toLocaleDateString("zh-CN")}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-950">手工赠课</h3>
          <form action={grantCourse} className="mt-5 space-y-4">
            <input name="phone" className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="手机号" required />
            <select name="courseId" className="w-full rounded-2xl border border-slate-200 px-4 py-3" required>
              <option value="">选择课程</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <input name="validityDays" type="number" min="1" defaultValue={365} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="有效天数，例如 365" required />
            <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white">开通权益</button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
