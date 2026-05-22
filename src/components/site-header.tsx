import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/courses", label: "课程" },
  { href: "/about", label: "关于我" },
  { href: "/my-courses", label: "我的课程" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
          专业课程学院
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          登录 / 购买
        </Link>
      </div>
    </header>
  );
}
