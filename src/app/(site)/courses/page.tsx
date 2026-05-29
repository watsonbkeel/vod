import { connection } from "next/server";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { getPublishedCourses } from "@/lib/courses";
import { formatMoney } from "@/lib/money";
import { formatTemplate } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";

export default async function CoursesPage() {
  await connection();
  const [courses, settings] = await Promise.all([getPublishedCourses(), getSiteSettings()]);
  const currentCourse = courses.find((course) => course.slug === settings.global.mainCourseSlug) ?? courses[0];
  const templateValues = {
    promoLabel: currentCourse?.promoLabel ?? settings.home.earlyBirdBadgeLabel,
    price: currentCourse ? formatMoney(currentCourse.priceCents, settings.global.currencyPrefix) : formatMoney(0, settings.global.currencyPrefix),
    regularPrice: currentCourse ? formatMoney(currentCourse.regularPriceCents, settings.global.currencyPrefix) : formatMoney(0, settings.global.currencyPrefix),
    validityDays: currentCourse?.validityDays ?? 365,
    serviceModel: settings.global.serviceModel,
  };
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-700">{settings.courses.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">{settings.courses.title}</h1>
          <p className="mt-4 leading-7 text-slate-600">
            {settings.courses.content}
          </p>
        </div>
        <div className="mt-8 grid gap-4 rounded-2xl bg-slate-950 p-5 text-white sm:rounded-3xl sm:p-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-emerald-200">{settings.courses.promoEyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold">{settings.courses.promoTitle}</h2>
          </div>
          <p className="text-sm leading-6 text-slate-300">{formatTemplate(settings.courses.promoText, templateValues)}</p>
          <p className="text-sm leading-6 text-slate-300">{formatTemplate(settings.courses.promoServiceText, templateValues)}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} settings={settings} />
          ))}
        </div>
      </section>
    </main>
  );
}
