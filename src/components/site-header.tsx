import Image from "next/image";
import Link from "next/link";
import { getUserSession } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { SITE_BRAND } from "@/lib/site-content";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/courses", label: "课程" },
  { href: "/about", label: "关于老师" },
  { href: "/my-courses", label: "我的课程" },
];

export async function SiteHeader() {
  const session = await getUserSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.sub }, select: { phone: true } })
    : null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
          <Image src={SITE_BRAND.logo} alt={SITE_BRAND.name} width={34} height={34} className="h-8 w-8 shrink-0 rounded-xl" />
          <span className="truncate">{SITE_BRAND.name}</span>
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
          <div className="flex items-center gap-2">
            <a href="/my-courses" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              {user.phone}
            </a>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                退出
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            登录 / 购买
          </Link>
        )}
      </div>
    </header>
  );
}
