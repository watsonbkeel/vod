import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getUserId } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { playableLessonWhere } from "@/lib/lessons/playable";
import { formatMoney } from "@/lib/money";
import { getOrderExpiresAt, isOrderExpired } from "@/lib/orders";
import { formatTemplate } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";

export default async function MyCoursesPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const [user, recentOrders, settings] = await Promise.all([
    prisma.user.findUnique({
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
                lessons: { where: playableLessonWhere(), orderBy: { sortOrder: "asc" } },
              },
            },
          },
          orderBy: { expiresAt: "desc" },
        },
      },
    }),
    prisma.order.findMany({
      where: { userId, channel: "alipay", status: { in: ["pending", "closed"] } },
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    getSiteSettings(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">{settings.global.myCoursesTitle}</h1>
        <p className="mt-4 text-slate-600">{formatTemplate(settings.global.myCoursesIntro, { supportEmail: settings.global.supportEmail })}</p>
        <div className="mt-8 grid gap-4">
          {!user || user.entitlements.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
              {settings.global.myCoursesEmpty}
            </div>
          ) : (
            user.entitlements.map((entitlement) => {
              const lessonCount = entitlement.course.lessons.length;
              return (
                <div key={entitlement.id} className="flex flex-col justify-between gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{entitlement.course.title}</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {settings.global.myCoursesValidityLabel}：{entitlement.expiresAt.toLocaleDateString("zh-CN")} · {settings.global.myCoursesLessonCountPrefix} {lessonCount} {settings.global.myCoursesPlayableLessonUnit}
                    </p>
                  </div>
                  <Link href={`/learn/${entitlement.course.id}`} className="rounded-full bg-slate-950 px-5 py-2 text-center text-sm font-medium text-white hover:bg-slate-800">
                    {settings.global.continueLearningLabel}
                  </Link>
                </div>
              );
            })
          )}
        </div>
        {recentOrders.length > 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-950">{settings.global.orderSectionTitle}</h2>
            <div className="mt-4 grid gap-3">
              {recentOrders.map((order) => {
                const expired = order.status === "closed" || isOrderExpired(order);
                return (
                  <div key={order.id} className="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 text-sm md:flex-row md:items-center">
                    <div>
                      <p className="font-medium text-slate-950">{order.course.title}</p>
                      <p className="mt-1 text-slate-500">
                        {formatMoney(order.amountCents, settings.global.currencyPrefix)} · {settings.global.purchasePaymentLabel} · {expired ? settings.global.orderExpiredText : `${settings.global.orderExpiresPrefix} ${getOrderExpiresAt(order).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`}
                      </p>
                    </div>
                    {expired ? (
                      <span className="rounded-full bg-slate-200 px-4 py-2 text-center text-xs font-medium text-slate-500">{settings.global.orderClosedLabel}</span>
                    ) : (
                      <Link href={`/orders/${order.id}`} className="rounded-full bg-orange-600 px-5 py-2 text-center text-sm font-medium text-white hover:bg-orange-500">
                        {settings.global.continuePayingLabel}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
