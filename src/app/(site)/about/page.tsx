import Image from "next/image";
import { connection } from "next/server";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AboutPage() {
  await connection();
  const settings = await getSiteSettings();
  const about = settings.about;
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
              <Image src={about.avatarImage} alt={about.avatarAlt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-emerald-200">{about.certificateEyebrow}</p>
            <h2 className="mt-2 text-xl font-semibold">{about.certificateTitle}</h2>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-white">
              <Image src={about.certificateImage} alt={about.certificateAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12">
          <p className="text-sm font-medium text-emerald-700">{about.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{about.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            {about.content}
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {about.cards.map((card) => (
              <div key={card.title} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                <h2 className="font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-3xl bg-emerald-50 p-6 ring-1 ring-emerald-100">
            <p className="text-sm font-medium text-emerald-800">{about.achievementsLabel}</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
              {about.achievements.map((item) => (
                <li key={item} className="rounded-2xl bg-white p-4">{item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-10 rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-emerald-200">{about.serviceLabel}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {about.serviceSteps.map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm text-slate-100">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
