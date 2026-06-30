import { Section, SectionHeading } from "@/components/ui/Section";
import { works } from "@/lib/content";

/** 制作実績（ポートフォリオ）。画像はCSSグラデーションのダミー。 */
export function Works() {
  return (
    <Section id="works" bg="muted">
      <SectionHeading
        eyebrow="Works"
        title="制作実績"
        description="業種・目的に合わせて成果を出してきた実績の一部をご紹介します。（サンプル）"
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {works.map((w) => (
          <article
            key={w.title}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-xl hover:shadow-slate-900/5"
          >
            <div className={`relative h-44 bg-gradient-to-br ${w.gradient}`}>
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 backdrop-blur">
                {w.category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {w.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
