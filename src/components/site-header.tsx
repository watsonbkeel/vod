import Image from "next/image";
import Link from "next/link";
import { getUserSession } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";

export async function SiteHeader() {
  const [session, settings] = await Promise.all([getUserSession(), getSiteSettings()]);
  const navItems = [
    { href: "/", label: settings.global.navHomeLabel },
    { href: "/courses", label: settings.global.navCoursesLabel },
    { href: "/about", label: settings.global.navAboutLabel },
    { href: "/my-courses", label: settings.global.navMyCoursesLabel },
  ];
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.sub }, select: { phone: true } })
    : null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex min-w-0 max-w-[58vw] items-center gap-2 text-base font-semibold tracking-tight text-slate-950 sm:max-w-none sm:text-lg">
          <Image src={settings.global.logo} alt={settings.global.name} width={34} height={34} className="h-8 w-8 shrink-0 rounded-xl" />
          <span className="truncate">{settings.global.name}</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            item.href === "/my-courses" ? (
              <a key={item.href} href={item.href} className="transition hover:text-slate-950">
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="transition hover:text-slate-950">
                {item.label}
              </Link>
            )
          ))}
        </nav>
        {user ? (
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a href="/my-courses" className="max-w-32 truncate rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 sm:max-w-44 sm:px-4">
              <span className="sm:hidden">{settings.global.navMyCoursesLabel}</span>
              <span className="hidden sm:inline">{user.phone}</span>
            </a>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded-full px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3">
                {settings.global.logoutLabel}
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {settings.global.loginCtaLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
