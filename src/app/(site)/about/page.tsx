import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12">
          <p className="text-sm font-medium text-cyan-700">关于讲师</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">用真实项目经验设计可落地的训练路径</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            这个个人站用于承载讲师的专业定位、课程体系和学员学习入口。课程强调结构化路径、真实案例和行动复盘，让学员在有效期内反复学习、逐步完成自己的实践闭环。
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["专业经历", "围绕真实项目、行业案例和一线问题，把经验整理成可复用的方法。"],
              ["代表成果", "展示过往案例、学员成果和可信背书，帮助访客快速建立信任。"],
              ["教学理念", "少讲空泛概念，多给路径、示范和复盘标准，让学习能落到行动。"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                <h2 className="font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-cyan-200">课程服务方式</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                "通过课程页了解内容与有效期",
                "购买或后台开通后进入我的课程",
                "按课时学习并持续记录进度",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm text-slate-100">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
