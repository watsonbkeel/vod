import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import { updateSiteContent } from "./actions";

const defaultContents = [
  {
    key: "home",
    label: "首页内容",
    title: "把复杂方法讲清楚，把学习结果真正落到行动里",
    content: "面向希望系统提升的学员，提供结构化视频课程、课时目录、有效期权益和学习进度记录。",
  },
  {
    key: "about",
    label: "关于我",
    title: "用真实项目经验设计可落地的训练路径",
    content: "这个个人站用于承载讲师的专业定位、课程体系和学员学习入口。",
  },
] as const;

export default async function AdminContentPage() {
  await requireAdminSession();

  const contents = await prisma.siteContent.findMany({
    where: { key: { in: defaultContents.map((item) => item.key) } },
  });

  return (
    <AdminShell title="站点内容">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">管理首页、关于我等创作者展示内容。</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {defaultContents.map((item) => {
            const content = contents.find((entry) => entry.key === item.key);
            return (
              <form key={item.key} action={updateSiteContent} className="rounded-2xl border border-slate-200 p-5">
                <input type="hidden" name="key" value={item.key} />
                <h3 className="font-medium text-slate-950">{item.label}</h3>
                <label className="mt-4 block text-sm font-medium text-slate-700">
                  标题
                  <input name="title" defaultValue={content?.title ?? item.title} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" required />
                </label>
                <label className="mt-4 block text-sm font-medium text-slate-700">
                  正文
                  <textarea name="content" defaultValue={content?.content ?? item.content} className="mt-2 min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" required />
                </label>
                <button className="mt-4 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800">保存内容</button>
              </form>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
