import Image from "next/image";
import Link from "next/link";
import { formatTemplate } from "@/lib/site-content";
import { formatMoney } from "@/lib/money";
import type { SiteConfig } from "@/lib/site-settings";

export type CourseCardData = {
  title: string;
  slug: string;
  coverUrl: string | null;
  summary: string;
  priceCents: number;
  regularPriceCents: number;
  promoLabel: string;
  price: string;
  validity: string;
  lessonCount: number;
};

export function CourseCard({ course, settings }: { course: CourseCardData; settings: SiteConfig }) {
  const hasPromotion = course.regularPriceCents > course.priceCents;
  const salePrice = formatMoney(course.priceCents, settings.global.currencyPrefix);
  const regularPrice = formatMoney(course.regularPriceCents, settings.global.currencyPrefix);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-900 px-8 text-center text-2xl font-semibold text-white">
        {course.coverUrl ? (
          <Image src={course.coverUrl} alt={formatTemplate(settings.global.courseCoverAltText, { courseTitle: course.title })} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        ) : (
          <span className="relative z-10">{course.title}</span>
        )}
        {course.coverUrl ? <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" /> : null}
        {hasPromotion ? <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">{course.promoLabel}</span> : null}
      </div>
      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{course.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{course.summary}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <span>{course.lessonCount} {settings.global.lessonCountUnitLabel}</span>
          <span>{settings.global.validityLabelPrefix} {course.validity}</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {hasPromotion ? <p className="text-xs text-slate-400 line-through">{settings.home.regularPriceBadgeLabel} {regularPrice}</p> : null}
            <span className="text-2xl font-semibold text-orange-600">{salePrice}</span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-full bg-slate-950 px-5 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {settings.global.courseCardCtaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
