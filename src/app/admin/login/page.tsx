import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-medium text-cyan-700">管理后台</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">管理员登录</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">使用 seed 创建的管理员账号登录，后续可扩展多管理员和角色权限。</p>
        <form action="/api/admin/auth/login" method="post" className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            用户名
            <input name="username" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="admin" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            密码
            <input name="password" type="password" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="请输入密码" required />
          </label>
          <button className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800">
            登录后台
          </button>
        </form>
      </div>
    </main>
  );
}
