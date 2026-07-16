import { Section, SectionHeading } from "@/components/ui/Section";
import { works } from "@/lib/content";

/** 制作実績（ポートフォリオ）。画像はCSSグラデーションのダミー。 */
export function Works() {
  return (
    <Section id="works">
      <SectionHeading
        eyebrow="Works"
        title="制作実績"
        description="業種・目的に合わせて成果を出してきた実績の一部をご紹介します。（サンプル）"
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {works.map((w, i) => (
          <article
            key={w.title}
            className="group panel panel-hover overflow-hidden"
            data-reveal
            style={{ "--reveal-delay": `${(i % 3) * 0.1}s` } as React.CSSProperties}
          >
            <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${w.gradient}`}>
              {/* ホバーでわずかにズームするシネマティック演出 */}
              <div
                aria-hidden
                className="bg-grid absolute inset-0 opacity-30 transition-transform duration-700 group-hover:scale-110"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
              />
              <span className="font-display absolute left-4 top-4 rounded-full border border-white/25 bg-ink/60 px-3 py-1 text-xs font-bold tracking-wider text-white backdrop-blur">
                {w.category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white transition-colors group-hover:text-brand-light">
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{w.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {w.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
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
