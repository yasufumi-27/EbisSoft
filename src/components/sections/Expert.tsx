import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/icons";
import { expert, qualityStandards } from "@/lib/content";
import { CountUp } from "@/components/fx/CountUp";

/**
 * 代表プロフィール＋品質基準（E-E-A-T：経験・専門性・権威性・信頼性）。
 * 「誰が・どんな基準で作っているか」を明文化し、Person構造化データ（personJsonLd）と同期。
 */
export function Expert() {
  return (
    <Section id="quality">
      <SectionHeading
        eyebrow="Expertise & Trust"
        title="誰が、どんな基準で作るのか"
        description="Webサイトの品質は「作る人」と「基準」で決まります。EbisSoftの制作体制と品質基準を公開します。"
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-5">
        {/* 代表プロフィール */}
        <div className="panel panel-corners p-8 lg:col-span-2" data-reveal>
          <div className="flex items-center gap-4">
            {/* アバター（写真差し替え推奨。現在はイニシャル表示） */}
            <span className="font-display grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand/80 to-accent/80 text-2xl font-bold text-ink shadow-[0_0_24px_rgba(34,211,238,0.35)]">
              {expert.reading.charAt(0)}
            </span>
            <div>
              <p className="text-lg font-bold text-white">{expert.name}</p>
              <p className="text-sm text-slate-400">{expert.role}</p>
            </div>
          </div>

          <p className="speakable mt-5 text-sm leading-relaxed text-slate-300">{expert.bio}</p>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="bg-ink-2/80 px-4 py-4 text-center">
              <dt className="text-xs text-slate-500">制作・改善の実績</dt>
              <dd className="font-display mt-1 text-xl font-bold">
                <CountUp value={`${expert.totalProjects}件+`} className="text-gradient" />
              </dd>
            </div>
            <div className="bg-ink-2/80 px-4 py-4 text-center">
              <dt className="text-xs text-slate-500">Web制作歴</dt>
              <dd className="font-display mt-1 text-xl font-bold">
                <CountUp value={`${expert.experienceYears}年`} className="text-gradient" />
              </dd>
            </div>
          </dl>

          <h3 className="mt-6 flex items-center gap-2 text-sm font-bold text-gold-light">
            <Icon name="award" className="size-4 text-gold" />
            保有資格
          </h3>
          <ul className="mt-3 space-y-2">
            {expert.credentials.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-sm text-slate-300">
                <Icon name="check" className="size-4 shrink-0 text-gold" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* 品質基準 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
          {qualityStandards.map((q, i) => (
            <div
              key={q.title}
              className="panel panel-hover p-6"
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 0.1 + 0.08}s` } as React.CSSProperties}
            >
              <span className="grid size-11 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand-light shadow-[0_0_18px_rgba(34,211,238,0.2)]">
                <Icon name={q.icon} className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-white">{q.title}</h3>
              <p className="speakable mt-2 text-sm leading-relaxed text-slate-400">{q.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
