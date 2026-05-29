import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PurchaseBox } from "@/components/purchase-box";
import { SiteHeader } from "@/components/site-header";
import { getUserId } from "@/lib/auth/user";
import { getPublishedCourseBySlug } from "@/lib/courses";
import { COURSE_DETAIL_CONTENT, MAIN_COURSE, SITE_BRAND } from "@/lib/site-content";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  await connection();
  const course = await getPublishedCourseBySlug(slug);
  const userId = await getUserId();

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="relative aspect-[16/9] bg-slate-900">
              <Image src={course.coverUrl ?? SITE_BRAND.courseCover} alt={`${course.title}封面`} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8">
            <p className="text-sm font-medium text-emerald-700">AI编程项目课 · 真实小程序作品</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{course.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {["9-15岁", "零基础可学", "真实项目", "录播+直播答疑"].map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{item}</span>
              ))}
            </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">课程大纲</h2>
            <div className="mt-6 divide-y divide-slate-100">
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center gap-4 py-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-slate-950">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{lesson.summary ?? "付费后在有效期内观看完整视频。"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContentSection title="学完你将获得" items={COURSE_DETAIL_CONTENT.outcomes} />
          <div className="grid gap-6 md:grid-cols-2">
            <ContentSection title="适合人群" items={COURSE_DETAIL_CONTENT.audience} />
            <ContentSection title="不适合人群" items={COURSE_DETAIL_CONTENT.notFor} />
          </div>
          <ContentSection title="课程特色" items={COURSE_DETAIL_CONTENT.highlights} />
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">学习前准备</h2>
            <p className="mt-4 leading-7 text-slate-600">{COURSE_DETAIL_CONTENT.requirements}</p>
          </div>
          <ContentSection title="购买须知" items={COURSE_DETAIL_CONTENT.purchaseNotes} />
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">退款规则</h2>
            <p className="mt-4 leading-7 text-slate-600">{COURSE_DETAIL_CONTENT.refundPolicy}</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">常见问题</h2>
            <div className="mt-6 divide-y divide-slate-100">
              {COURSE_DETAIL_CONTENT.faq.map((item) => (
                <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="font-semibold text-slate-950">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24">
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-cyan-800 p-6 text-white">
            <p className="text-sm text-cyan-100">早鸟价</p>
            <p className="mt-2 text-4xl font-bold">¥{course.priceCents / 100}</p>
            <p className="mt-2 text-sm text-slate-300 line-through">正价 ¥{MAIN_COURSE.regularPriceCents / 100}</p>
            <p className="mt-3 text-sm text-slate-200">购买后有效期 {course.validity}</p>
          </div>
          <dl className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <dt>课时数量</dt>
              <dd className="font-medium text-slate-950">{course.lessonCount} 个</dd>
            </div>
            <div className="flex justify-between">
              <dt>观看方式</dt>
              <dd className="font-medium text-slate-950">PC / 手机 H5</dd>
            </div>
            <div className="flex justify-between">
              <dt>服务形式</dt>
              <dd className="font-medium text-slate-950">录播+直播答疑</dd>
            </div>
            <div className="flex justify-between">
              <dt>适合年龄</dt>
              <dd className="font-medium text-slate-950">{MAIN_COURSE.ageRange}</dd>
            </div>
          </dl>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            当前仅展示已上传并可播放的课时。新课时完成视频绑定后会自动进入课程目录。支付成功后进入“我的课程”学习，售后邮箱：{SITE_BRAND.supportEmail}
          </div>
          <PurchaseBox courseId={course.id} signedIn={Boolean(userId)} />
        </aside>
      </section>
    </main>
  );
}

function ContentSection({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
