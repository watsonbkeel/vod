import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto flex max-w-md px-4 py-16 sm:px-6">
        <div className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-cyan-700">手机号登录</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">登录后购买和学习课程</h1>
          <form className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              手机号
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="请输入手机号" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              验证码
              <div className="mt-2 flex gap-2">
                <input className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="短信验证码" />
                <button type="button" className="rounded-2xl border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:border-slate-950">
                  获取验证码
                </button>
              </div>
            </label>
            <button type="button" className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800">
              登录
            </button>
          </form>
          <p className="mt-5 text-xs leading-5 text-slate-500">验证码接口会接入腾讯云 SMS；登录成功后自动注册账号。</p>
        </div>
      </section>
    </main>
  );
}
