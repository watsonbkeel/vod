import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { getPublishedCourses } from "@/lib/courses";
import { formatMoney } from "@/lib/money";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  await connection();
  const [courses, settings] = await Promise.all([
    getPublishedCourses(),
    getSiteSettings(),
  ]);
  const home = settings.home;
  const global = settings.global;
  const featuredCourse = courses[0];
  const featuredSalePrice = featuredCourse ? formatMoney(featuredCourse.priceCents, global.currencyPrefix) : formatMoney(0, global.currencyPrefix);
  const featuredRegularPrice = featuredCourse ? formatMoney(featuredCourse.regularPriceCents, global.currencyPrefix) : formatMoney(0, global.currencyPrefix);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-18">
        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100 sm:mb-5">
            {home.eyebrow}
          </span>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            {home.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            {home.content}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link href={home.primaryCtaHref} className="rounded-full bg-slate-950 px-6 py-3 text-center font-medium text-white hover:bg-slate-800">
              {home.primaryCtaLabel}
            </Link>
            <Link href={home.secondaryCtaHref} className="rounded-full border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 hover:border-slate-950 hover:text-slate-950">
              {home.secondaryCtaLabel}
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:rounded-3xl">
            <div className="relative aspect-[4/3] bg-slate-900 sm:aspect-[4/3]">
              <Image src={home.heroImage} alt={home.heroImageAlt} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{featuredCourse?.promoLabel ?? home.earlyBirdBadgeLabel} {featuredSalePrice}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 line-through">{home.regularPriceBadgeLabel} {featuredRegularPrice}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{global.serviceModel}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold sm:text-2xl">{featuredCourse?.title ?? home.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{featuredCourse?.summary ?? home.content}</p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs sm:gap-3 sm:text-sm">
                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <strong className="block text-xl text-slate-950 sm:text-2xl">{featuredCourse?.lessonCount ?? 8}</strong>课时
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <strong className="block text-xl text-slate-950 sm:text-2xl">{featuredCourse?.validityDays ?? 365}</strong>天有效
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                  <strong className="block text-xl text-slate-950 sm:text-2xl">{global.ageRange}</strong>适合
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
          {home.features.map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 rounded-3xl bg-slate-950 p-6 text-white md:grid-cols-3 md:p-8">
          <div>
            <p className="text-sm text-emerald-200">{home.audienceLabel}</p>
            <h2 className="mt-2 text-2xl font-semibold">{home.audienceTitle}</h2>
          </div>
          <p className="text-sm leading-6 text-slate-300">{home.audience}</p>
          <p className="text-sm leading-6 text-slate-300">{home.notAudience}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[260px_1fr] md:p-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
            <Image src={home.teacherImage} alt={home.teacherImageAlt} fill sizes="(min-width: 768px) 260px, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-emerald-700">{home.teacherLabel}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">{home.teacherTitle}</h2>
            <p className="mt-4 leading-7 text-slate-600">{home.teacherIntro}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {home.teacherAchievements.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-700">{home.coursesEyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">{home.coursesTitle}</h2>
          </div>
          <Link href="/courses" className="text-sm font-medium text-slate-600 hover:text-slate-950">
            {home.coursesLinkLabel}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} settings={settings} />
          ))}
        </div>
      </section>
    </main>
  );
}
