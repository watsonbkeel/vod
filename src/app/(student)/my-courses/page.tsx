import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";

export default async function MyCoursesPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      entitlements: {
        where: {
          status: "active",
          startsAt: { lte: new Date() },
          expiresAt: { gt: new Date() },
        },
        include: {
          course: {
            include: {
              lessons: { where: { status: "published" }, orderBy: { sortOrder: "asc" } },
            },
          },
        },
        orderBy: { expiresAt: "desc" },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">我的课程</h1>
        <p className="mt-4 text-slate-600">这里会展示已购买或后台赠送的课程、到期时间和学习进度。</p>
        <div className="mt-8 grid gap-4">
          {!user || user.entitlements.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">暂无已开通课程</div>
          ) : (
            user.entitlements.map((entitlement) => {
              const lessonCount = entitlement.course.lessons.length;
              return (
                <div key={entitlement.id} className="flex flex-col justify-between gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{entitlement.course.title}</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      有效期至：{entitlement.expiresAt.toLocaleDateString("zh-CN")} · 共 {lessonCount} 个已发布课时
                    </p>
                  </div>
                  <Link href={`/learn/${entitlement.course.id}`} className="rounded-full bg-slate-950 px-5 py-2 text-center text-sm font-medium text-white hover:bg-slate-800">
                    继续学习
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
