import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { stats } from "@/lib/content";
import { siteConfig } from "@/lib/site";

/**
 * ファーストビュー。ページ内で唯一の <h1> を置き、主要キーワードを含めます。
 * LCP最優先のため、ビジュアルは画像ではなくCSSで構築しています。
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* 背景の装飾（読み込み負荷ゼロのCSSグラデーション） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-indigo-50),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 -z-10 size-[36rem] rounded-full bg-violet-200/40 blur-3xl"
      />

      <Container className="grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-8 lg:py-28">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-1.5 text-sm font-semibold text-brand-dark ring-1 ring-brand/10">
              <Icon name="pin" className="size-4" />
              {siteConfig.contact.address.region}
              {siteConfig.contact.address.locality}のWeb制作会社 {siteConfig.name}
            </p>
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white">
              <Icon name="sparkles" className="size-4 text-brand-light" />
              AI検索（AEO / LLMO）対応
            </p>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
            <span className="bg-gradient-to-r from-brand to-violet-500 bg-clip-text text-transparent">
              成果
            </span>
            から逆算する
            <br />
            ホームページ制作・Web制作
          </h1>

          <p className="speakable mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            「きれいなだけ」で終わらせません。集客・採用・売上といったゴールから逆算し、戦略設計・SEO・AEO / LLMO（AI検索最適化）・表示速度まで作り込む。
            検索エンジンにも生成AIにも“選ばれる”Webサイトを、ワンストップでご提供します。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#contact" size="lg" withArrow>
              無料で相談する
            </ButtonLink>
            <ButtonLink href="#works" size="lg" variant="secondary">
              制作実績を見る
            </ButtonLink>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            初回相談・お見積もりは無料です。まずはお気軽にご相談ください。
          </p>
        </div>

        {/* ブラウザ風モックアップ（CSSのみ） */}
        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
              <span className="size-3 rounded-full bg-rose-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
              <span className="ml-3 h-5 flex-1 rounded-md bg-slate-100" />
            </div>
            <div className="space-y-4 p-5">
              <div className="flex h-40 items-end gap-2 rounded-xl bg-gradient-to-br from-brand via-violet-500 to-sky-400 p-4">
                <span className="h-1/2 w-1/4 rounded-md bg-white/30" />
                <span className="h-3/4 w-1/4 rounded-md bg-white/40" />
                <span className="h-2/5 w-1/4 rounded-md bg-white/30" />
                <span className="h-full w-1/4 rounded-md bg-white/50" />
              </div>
              <div className="space-y-2">
                <span className="block h-3 w-2/3 rounded-full bg-slate-200" />
                <span className="block h-3 w-1/2 rounded-full bg-slate-100" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-slate-100 p-3">
                    <span className="block size-6 rounded-md bg-brand-light" />
                    <span className="mt-2 block h-2 w-full rounded-full bg-slate-100" />
                    <span className="mt-1.5 block h-2 w-2/3 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 速度バッジ */}
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-slate-200 bg-white p-3 shadow-lg sm:flex sm:items-center sm:gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Icon name="gauge" className="size-5" />
            </span>
            <span className="text-sm">
              <span className="block font-bold text-slate-900">表示速度 100点</span>
              <span className="block text-slate-500">Core Web Vitals最適化</span>
            </span>
          </div>
        </div>
      </Container>

      {/* 信頼指標 */}
      <Container className="pb-16 lg:pb-20">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-6 py-6 text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-3xl font-bold tracking-tight text-slate-900">
                  {s.value}
                </span>
                <span className="mt-1 block text-sm text-slate-500">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
