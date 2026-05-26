import type { Lesson } from "@prisma/client";

export function LessonForm({
  action,
  lesson,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  lesson?: Lesson;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          课时标题
          <input name="title" defaultValue={lesson?.title} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          状态
          <select name="status" defaultValue={lesson?.status ?? "draft"} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
            <option value="draft">草稿</option>
            <option value="published">上架</option>
            <option value="hidden">隐藏</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        课时简介
        <input name="summary" defaultValue={lesson?.summary ?? ""} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="可选" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          排序
          <input name="sortOrder" type="number" defaultValue={lesson?.sortOrder ?? 0} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          时长（秒）
          <input name="durationSec" type="number" min="0" defaultValue={lesson?.durationSec ?? ""} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="上传视频后可补充" />
        </label>
      </div>
      <button className="w-fit rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
        {submitLabel}
      </button>
    </form>
  );
}
