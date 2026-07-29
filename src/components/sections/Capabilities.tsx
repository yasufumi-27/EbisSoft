"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/icons";
import { DemoLoader } from "@/components/demos/DemoLoader";
import { capabilities } from "@/lib/content";

/**
 * 「こんなことができます」セクション。
 *
 * 見せる順番は「事業へのインパクト → 実物のデモ → 技術の話」。
 * 技術名から入らないことで、発注側が自分の事業に置き換えて読めるようにしています。
 * 説明テキストは常にHTMLへ出力し（SEO/AEO）、重いデモ本体だけを遅延読込します。
 */
export function Capabilities() {
  const [active, setActive] = useState(capabilities[0].slug);
  const current = capabilities.find((c) => c.slug === active) ?? capabilities[0];
  const liveRef = useRef<HTMLDivElement>(null);

  /**
   * カードを選んだら、デモ本体が見える位置まで送る。
   * カード一覧の下にデモがあるため、選んだだけでは画面外のままになり
   * 「押しても何も起きない」ように見えてしまう。
   */
  const showDemo = useCallback((slug: string) => {
    setActive(slug);
    // 状態反映（＝デモの差し替え）を待ってからスクロールする
    requestAnimationFrame(() => {
      const el = liveRef.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  }, []);

  return (
    <Section id="capabilities">
      <SectionHeading
        eyebrow="Capabilities"
        title={
          <>
            こんなことが、できます。
            <br />
            <span className="text-gradient">しかも、11個で2時間。</span>
          </>
        }
        description="下のデモはすべて本物です。そしてこの11個は、AIを活用して合計約2時間で実装しました。"
      />

      {/* できること一覧：技術名ではなく「事業がどう変わるか」を主役にする */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {capabilities.map((c, i) => {
          const isActive = c.slug === active;
          return (
            <article
              key={c.slug}
              className={`panel panel-hover flex flex-col p-5 transition-all ${
                isActive ? "border-brand/60 shadow-[0_0_30px_-8px_rgba(34,211,238,0.45)]" : ""
              }`}
              data-reveal
              style={{ "--reveal-delay": `${i * 0.07}s` } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => showDemo(c.slug)}
                aria-pressed={isActive}
                aria-controls="live-demo"
                className="flex flex-1 flex-col text-left"
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`grid size-11 place-items-center rounded-xl border transition-colors ${
                      isActive
                        ? "border-brand/50 bg-brand/15 text-brand-light shadow-[0_0_18px_rgba(34,211,238,0.3)]"
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  {/* 制作時間バッジ＝「速さ」の証拠 */}
                  <span className="font-display rounded-md border border-gold/30 bg-gold/10 px-2 py-1 text-[10px] font-bold tracking-wider text-gold-light">
                    {c.buildTime}
                  </span>
                </span>

                <h3 className="mt-4 text-base font-bold text-white">{c.title}</h3>
                <p className="mt-1 text-sm text-brand-light">{c.tagline}</p>
                {/* 事業インパクト：ここが一番読ませたい一行 */}
                <p className="mt-3 flex-1 text-sm leading-relaxed font-medium text-slate-300">
                  {c.impact}
                </p>
              </button>

              <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => showDemo(c.slug)}
                  aria-controls="live-demo"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    isActive ? "text-brand-light" : "text-slate-500 hover:text-brand-light"
                  }`}
                >
                  <Icon name="play" className="size-3.5" />
                  {isActive ? "デモを表示中" : "デモを見る"}
                </button>
                <Link
                  href={`/demo/${c.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-white"
                >
                  導入効果を読む
                  <Icon name="arrowRight" className="size-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* 選択中のデモ（その場で動きます） */}
      <div ref={liveRef} id="live-demo" className="mt-12 scroll-mt-24" data-reveal>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Live Demo</p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {current.title}
              <span className="ml-3 align-middle text-sm font-normal text-slate-500">
                実装時間 {current.buildTime}
              </span>
            </h3>
          </div>
          <Link
            href={`/demo/${current.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light transition-colors hover:bg-gold/20"
          >
            導入するとどうなるか
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        {/* slug をキーにして、切り替えのたびにデモを作り直す（状態の混線を防ぐ） */}
        <DemoLoader key={current.slug} slug={current.slug} />

        {/* デモの前提は読みたい人だけが開けばよいので折りたたむ（本文はDOMに残るのでSEOに影響なし） */}
        <details className="demo-note mt-4">
          <summary>
            <span className="font-display mr-2 text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
              Note
            </span>
            このデモはどこまでが実装で、本番では何が変わるか
          </summary>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">{current.demoNote}</p>
        </details>
      </div>
    </Section>
  );
}
