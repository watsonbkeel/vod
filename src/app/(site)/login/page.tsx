import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto flex max-w-md px-4 py-16 sm:px-6">
        <div className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-cyan-700">手机号登录</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">登录后购买和学习课程</h1>
          <LoginForm />
          <p className="mt-5 text-xs leading-5 text-slate-500">验证码接口会接入腾讯云 SMS；登录成功后自动注册账号。</p>
        </div>
      </section>
    </main>
  );
}
