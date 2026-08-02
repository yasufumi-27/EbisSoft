import { Container } from "@/components/ui/Container";
import HeroConsole from "@/components/sections/HeroConsole";
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
        {/* min-w-0：グリッド項目の既定（min-width:auto）だと中身の最小幅で列が広がり、
            狭い端末で右端がはみ出すため、必ず縮めるようにしておく */}
        <div className="min-w-0" data-reveal>
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand-light shadow-[0_0_18px_rgba(34,211,238,0.18)] backdrop-blur">
              <Icon name="pin" className="size-4" />
              {siteConfig.contact.address.region}
              {siteConfig.contact.address.locality}のWeb制作会社 {siteConfig.name}
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-light backdrop-blur">
              <Icon name="sparkles" className="size-4 animate-pulse-glow" />
              AI活用 × AI検索（AEO / LLMO）対応
            </p>
          </div>

          {/* 英字ラベル：見出しの上に置く一本の情報線（HUDの静けさ） */}
          <p className="eyebrow mt-9 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem]">
            <span aria-hidden className="size-1.5 rounded-full bg-brand shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            AI × Web Production
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-brand/70 to-transparent" />
            Kyoto, Japan
          </p>

          {/* 行ごとに立ち上がる見出し（文字は分割していないので折り返し・読み上げに影響なし） */}
          {/* [word-break:keep-all] は語の途中で折らないぶん、狭い端末では1行が伸びる。
              画面幅に追従する clamp で字送りを決め、どの端末でも見切れないようにする。 */}
          <h1 className="mt-4 text-[clamp(1.75rem,8.2vw,2.25rem)] font-bold leading-[1.16] tracking-tight text-white [word-break:keep-all] sm:text-5xl lg:text-[3.5rem]">
            <span className="hero-line">
              <span style={{ "--line-delay": "0.08s" } as React.CSSProperties}>
                <span className="text-gradient">AI</span>を駆使して、
              </span>
            </span>
            <span className="hero-line">
              <span style={{ "--line-delay": "0.26s" } as React.CSSProperties}>
                <span className="text-gradient">最速</span>で、
                <span className="text-gold">高性能</span>なサイトを。
              </span>
            </span>
          </h1>

          <p className="speakable mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            {siteConfig.contact.address.locality}のAI活用型Web制作会社。
            <strong className="font-bold text-white">制作期間は従来の約1/3、最短5日で公開</strong>
            します。
          </p>

          {/* できることは文章で説明せず、実物への導線にする */}
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
            3DCG・AR・料金シミュレーター・商品カスタマイズ・AIレコメンド・AIチャットボット。できることは15領域すべて、動くデモで確かめられます。
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" withArrow>
              無料で相談する
            </ButtonLink>
            <ButtonLink href="/#capabilities" size="lg" variant="secondary">
              デモを体験する
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            初回相談・お見積もりは無料です。まずはお気軽にご相談ください。
          </p>
        </div>

        {/* AI制作パイプラインのコンソール（工程ごとのAI／人の分担を可視化） */}
        <div className="relative min-w-0" data-reveal style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}>
          <Tilt>
            <div className="animate-float">
              <HeroConsole />
            </div>
          </Tilt>

          {/* 速度バッジ */}
          <div className="panel absolute -bottom-9 -left-6 hidden p-3 shadow-[0_0_30px_rgba(16,185,129,0.15)] sm:flex sm:items-center sm:gap-3">
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
