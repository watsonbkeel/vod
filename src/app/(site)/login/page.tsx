import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/site-settings";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto flex max-w-md px-4 py-16 sm:px-6">
        <div className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-cyan-700">{settings.global.loginEyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">{settings.global.loginTitle}</h1>
          <LoginForm initialError={error ? decodeURIComponent(error) : ""} settings={settings.global} />
          <p className="mt-5 text-xs leading-5 text-slate-500">{settings.global.loginHint}</p>
        </div>
      </section>
    </main>
  );
}
