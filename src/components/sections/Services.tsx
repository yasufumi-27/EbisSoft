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
        {services.map((s, i) => (
          <article
            key={s.slug}
            className="group panel panel-hover panel-corners flex flex-col p-7"
            data-reveal
            style={{ "--reveal-delay": `${(i % 3) * 0.1}s` } as React.CSSProperties}
          >
            <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-brand/80 to-accent/80 text-ink shadow-[0_0_22px_rgba(34,211,238,0.35)] transition-shadow group-hover:shadow-[0_0_32px_rgba(34,211,238,0.6)]">
              <Icon name={s.icon} className="size-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{s.description}</p>
            <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Icon name="check" className="size-4 shrink-0 text-gold" />
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
