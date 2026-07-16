import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { CountUp } from "@/components/fx/CountUp";
import { Tilt } from "@/components/fx/Tilt";
import { stats } from "@/lib/content";
import { siteConfig } from "@/lib/site";

/**
 * ファーストビュー。ページ内で唯一の <h1> を置き、主要キーワードを含めます。
 * 背景は layout の3D CG（ThreeBackground）が透けて見えるシネマティック構成。
 * LCP最優先のため、前景ビジュアルは画像ではなくCSSで構築しています。
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 奥行きを強調する光芒（3D背景の上に重ねるCSSグロー） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_50%_-10%,rgba(34,211,238,0.14),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] -z-10 size-[38rem] rounded-full bg-accent/15 blur-3xl"
      />
      {/* HUD風の微細グリッド */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />

      <Container className="grid items-center gap-14 py-24 sm:py-28 lg:grid-cols-2 lg:gap-10 lg:py-36">
        <div data-reveal>
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand-light shadow-[0_0_18px_rgba(34,211,238,0.18)] backdrop-blur">
              <Icon name="pin" className="size-4" />
              {siteConfig.contact.address.region}
              {siteConfig.contact.address.locality}のWeb制作会社 {siteConfig.name}
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-light backdrop-blur">
              <Icon name="sparkles" className="size-4 animate-pulse-glow" />
              AI検索（AEO / LLMO）対応
            </p>
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
            <span className="text-gradient">成果</span>
            から逆算する
            <br />
            ホームページ制作・Web制作
          </h1>

          <p className="speakable mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            「きれいなだけ」で終わらせません。集客・採用・売上といったゴールから逆算し、戦略設計・SEO・AEO / LLMO（AI検索最適化）・表示速度まで作り込む。
            3DCG・WebGL演出や動画制作まで含めて、検索エンジンにも生成AIにも“選ばれる”Webサイトをワンストップでご提供します。
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#contact" size="lg" withArrow>
              無料で相談する
            </ButtonLink>
            <ButtonLink href="#works" size="lg" variant="secondary">
              制作実績を見る
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            初回相談・お見積もりは無料です。まずはお気軽にご相談ください。
          </p>
        </div>

        {/* HUD風ダッシュボードのモックアップ（CSSのみ・ゆっくり浮遊） */}
        <div className="relative" data-reveal style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}>
          <Tilt>
          <div className="animate-float">
            <div className="panel panel-corners overflow-hidden shadow-[0_30px_80px_-30px_rgba(34,211,238,0.25)]">
              {/* タイトルバー */}
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="size-3 rounded-full bg-rose-400/80" />
                <span className="size-3 rounded-full bg-amber-300/80" />
                <span className="size-3 rounded-full bg-emerald-400/80" />
                <span className="font-display ml-3 flex h-5 flex-1 items-center rounded-md bg-white/5 px-2 text-[10px] tracking-[0.25em] text-slate-500">
                  EBISSOFT.ANALYTICS
                </span>
              </div>
              <div className="space-y-4 p-5">
                {/* グラフエリア */}
                <div className="relative flex h-40 items-end gap-2 overflow-hidden rounded-xl border border-brand/20 bg-gradient-to-br from-brand/15 via-accent/10 to-transparent p-4">
                  <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
                  <span className="relative h-1/2 w-1/4 rounded-sm bg-gradient-to-t from-brand/20 to-brand/60" />
                  <span className="relative h-3/4 w-1/4 rounded-sm bg-gradient-to-t from-brand/25 to-brand/70" />
                  <span className="relative h-2/5 w-1/4 rounded-sm bg-gradient-to-t from-accent/25 to-accent/60" />
                  <span className="relative h-full w-1/4 rounded-sm bg-gradient-to-t from-gold/30 to-gold/80" />
                </div>
                <div className="space-y-2">
                  <span className="block h-3 w-2/3 rounded-full bg-white/10" />
                  <span className="block h-3 w-1/2 rounded-full bg-white/5" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <span className="block size-6 rounded-md bg-brand/25 shadow-[0_0_10px_rgba(34,211,238,0.35)]" />
                      <span className="mt-2 block h-2 w-full rounded-full bg-white/10" />
                      <span className="mt-1.5 block h-2 w-2/3 rounded-full bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </Tilt>

          {/* 速度バッジ */}
          <div className="panel absolute -bottom-5 -left-5 hidden p-3 shadow-[0_0_30px_rgba(16,185,129,0.15)] sm:flex sm:items-center sm:gap-3">
            <span className="grid size-10 place-items-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <Icon name="gauge" className="size-5" />
            </span>
            <span className="text-sm">
              <span className="block font-bold text-white">表示速度 100点</span>
              <span className="block text-slate-400">Core Web Vitals最適化</span>
            </span>
          </div>
        </div>
      </Container>

      {/* 信頼指標：HUD風の計器パネル */}
      <Container className="pb-20 lg:pb-24">
        <dl className="panel panel-corners grid grid-cols-2 divide-x divide-white/5 overflow-hidden sm:grid-cols-4" data-reveal>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative px-6 py-7 text-center"
              style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display block text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  <CountUp value={s.value} className="text-gradient" />
                </span>
                <span className="mt-2 block text-sm text-slate-400">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
