import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto flex max-w-md px-4 py-16 sm:px-6">
        <div className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-cyan-700">账号密码登录</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">登录后购买和学习课程</h1>
          <LoginForm initialError={error ? decodeURIComponent(error) : ""} />
          <p className="mt-5 text-xs leading-5 text-slate-500">首次使用手机号和密码会自动创建账号；之后用同一手机号和密码登录。</p>
        </div>
      </section>
    </main>
  );
}
