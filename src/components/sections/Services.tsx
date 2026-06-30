import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/icons";
import { services } from "@/lib/content";

/** 提供サービス一覧。 */
export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="Service"
        title="Web制作サービス"
        description="コーポレートサイトからLP・EC・Webアプリ・SEOまで。事業の課題に合わせて最適な形をご提案します。"
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article
            key={s.slug}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-slate-900/5"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-slate-900 text-white transition-colors group-hover:bg-brand">
              <Icon name={s.icon} className="size-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-900">{s.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{s.description}</p>
            <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <Icon name="check" className="size-4 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
