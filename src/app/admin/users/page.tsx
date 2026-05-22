import { AdminShell } from "@/components/admin-shell";

export default function AdminUsersPage() {
  return (
    <AdminShell title="用户与赠课">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">用户列表会展示手机号、注册时间、已购课程和权益到期时间。</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center text-slate-500">暂无用户</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-950">手工赠课</h3>
          <form className="mt-5 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="手机号" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="课程 ID / 名称" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="有效天数，例如 365" />
            <button type="button" className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white">开通权益</button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
