import { AdminShell } from "@/components/admin-shell";

export default function AdminContentPage() {
  return (
    <AdminShell title="站点内容">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">管理首页、关于我、课程介绍等创作者展示内容。</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {['首页内容', '关于我'].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-medium text-slate-950">{item}</h3>
              <p className="mt-2 text-sm text-slate-500">后续接入富文本/Markdown 编辑能力。</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
