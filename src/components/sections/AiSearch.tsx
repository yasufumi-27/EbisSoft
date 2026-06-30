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
    <section id="ai-search" className="relative scroll-mt-20 overflow-hidden bg-slate-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-0 size-[40rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-brand-light ring-1 ring-white/15">
            <Icon name="sparkles" className="size-4" />
            AEO / LLMO 特化
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            AI検索時代のWeb集客に、
            <br className="hidden sm:block" />
            最初から対応します
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
          {aeo.definitions.map((d) => (
            <div key={d.term} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-brand-light">{d.term}</span>
                <span className="text-sm text-slate-400">{d.full}</span>
              </div>
              <p className="speakable mt-3 text-slate-300">{d.description}</p>
            </div>
          ))}
        </div>

        {/* 具体的な施策 */}
        <h3 className="mt-14 text-xl font-bold">EbisSoftが実装するAEO / LLMO施策</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aeo.tactics.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition-colors hover:bg-white/10"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet-500 text-white">
                <Icon name={t.icon} className="size-5" />
              </span>
              <h4 className="mt-4 font-bold">{t.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{t.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <ButtonLink href="#contact" size="lg" withArrow>
            AI検索対策について相談する
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
