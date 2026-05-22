import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12">
          <p className="text-sm font-medium text-cyan-700">关于讲师</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">用真实经验设计可落地的课程</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            这里用于展示你的个人经历、专业背景、代表案例和课程理念。第一版先以结构化内容承载个人品牌，后续可在后台直接编辑。
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["专业经历", "代表成果", "教学理念"].map((title) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                <h2 className="font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">填写你的可信背书、项目案例和能帮助学员获得的具体结果。</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
