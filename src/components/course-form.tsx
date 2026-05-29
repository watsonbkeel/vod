import type { Course } from "@prisma/client";

export function CourseForm({
  action,
  course,
  submitLabel,
  currencyPrefix = "HK$",
}: {
  action: (formData: FormData) => void | Promise<void>;
  course?: Course;
  submitLabel: string;
  currencyPrefix?: string;
}) {
  return (
    <form action={action} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          课程标题
          <input name="title" defaultValue={course?.title} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          URL Slug
          <input name="slug" defaultValue={course?.slug} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="practical-training" required />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        课程封面图片 URL
        <input name="coverUrl" defaultValue={course?.coverUrl ?? ""} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="/assets/images/courses/course-cover.jpg 或 COS HTTPS URL" />
        <span className="mt-1 block text-xs leading-5 text-slate-400">建议 1600 x 900 px，16:9 横图，主体居中；可使用 public 下路径或公网可访问的 COS HTTPS URL，不要使用会过期的签名 URL。</span>
      </label>
      <label className="block text-sm font-medium text-slate-700">
        课程简介
        <input name="summary" defaultValue={course?.summary} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        详情介绍
        <textarea name="description" defaultValue={course?.description} rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          原价（{currencyPrefix}）
          <input name="regularPriceYuan" type="number" min="0" step="0.01" defaultValue={course ? course.regularPriceCents / 100 : 999} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          促销价文案
          <input name="promoLabel" defaultValue={course?.promoLabel ?? "早鸟价"} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="早鸟价 / 新春价 / 暑期价" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          实际支付金额（{currencyPrefix}）
          <input name="priceYuan" type="number" min="0" step="0.01" defaultValue={course ? course.priceCents / 100 : 699} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          有效期（天）
          <input name="validityDays" type="number" min="1" defaultValue={course?.validityDays ?? 365} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          排序
          <input name="sortOrder" type="number" defaultValue={course?.sortOrder ?? 0} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          状态
          <select name="status" defaultValue={course?.status ?? "draft"} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
            <option value="draft">草稿</option>
            <option value="published">上架</option>
            <option value="archived">归档</option>
          </select>
        </label>
      </div>
      <button className="w-fit rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
        {submitLabel}
      </button>
    </form>
  );
}
