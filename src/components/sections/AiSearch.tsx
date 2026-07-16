import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { aeo } from "@/lib/content";

/**
 * AEO / LLMO（AI検索最適化）特化セクション。
 * 「定義 → EbisSoftの具体的な施策」を結論ファーストで提示し、
 * このサイト自体がAEO/LLMOの実装例になるよう構成しています。
 */
export function AiSearch() {
  return (
    <section id="ai-search" className="relative scroll-mt-20 overflow-hidden">
      {/* このセクションだけ一段深い面＋強い光芒で世界観を切り替える */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-2/80 backdrop-blur-[2px]" />
      <div aria-hidden className="divider-glow absolute inset-x-0 top-0" />
      <div aria-hidden className="divider-glow absolute inset-x-0 bottom-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-0 size-[42rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
      />

      <Container className="relative py-20 sm:py-28">
        <div className="max-w-2xl" data-reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-light backdrop-blur">
            <Icon name="sparkles" className="size-4 animate-pulse-glow" />
            AEO / LLMO 特化
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI検索時代のWeb集客に、
            <br className="hidden sm:block" />
            <span className="text-gradient">最初から対応</span>します
          </h2>
          <p className="speakable mt-5 text-lg leading-relaxed text-slate-300">
            これからの集客は、Google検索だけでなく
            <strong className="font-semibold text-white">
              AI Overviews・ChatGPT・Perplexity・Gemini
            </strong>
            などの「答えを返すAI」に
            <strong className="font-semibold text-white">引用・推薦されること</strong>
            が鍵になります。EbisSoftは制作の最初からAEO / LLMOを設計に組み込みます。
          </p>
        </div>

        {/* 用語の定義（結論ファースト） */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {aeo.definitions.map((d, i) => (
            <div
              key={d.term}
              className="panel panel-corners p-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 0.12}s` } as React.CSSProperties}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold tracking-wider">
                  <span className="text-gradient">{d.term}</span>
                </span>
                <span className="text-sm text-slate-500">{d.full}</span>
              </div>
              <p className="speakable mt-3 text-slate-300">{d.description}</p>
            </div>
          ))}
        </div>

        {/* 具体的な施策 */}
        <h3 className="mt-14 text-xl font-bold text-white" data-reveal>
          EbisSoftが実装するAEO / LLMO施策
        </h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aeo.tactics.map((t, i) => (
            <div
              key={t.title}
              className="panel panel-hover p-6"
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 0.1}s` } as React.CSSProperties}
            >
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-ink shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <Icon name={t.icon} className="size-5" />
              </span>
              <h4 className="mt-4 font-bold text-white">{t.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12" data-reveal>
          <ButtonLink href="#contact" size="lg" withArrow>
            AI検索対策について相談する
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
