import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/courses", label: "课程管理" },
  { href: "/admin/orders", label: "订单管理" },
  { href: "/admin/users", label: "用户与赠课" },
  { href: "/admin/content", label: "站点内容" },
];

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
        <h1 className="text-lg font-semibold text-slate-950">课程后台</h1>
        <nav className="mt-8 space-y-2">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="p-4 md:ml-64 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h2>
          <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-slate-950 hover:text-slate-950">
            返回前台
          </Link>
        </div>
        {children}
      </section>
    </main>
  );
}
