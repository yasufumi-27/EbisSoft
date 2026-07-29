"use client";

import { useState } from "react";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/icons";
import { DemoLoader } from "@/components/demos/DemoLoader";
import { capabilities } from "@/lib/content";

/**
 * 「こんなことができます」セクション。
 *
 * 主張だけで終わらせず、5つの領域すべてを**その場で動かせるデモ**として掲載します。
 * 説明テキストは常にすべてHTMLに出力し（SEO/AEO）、重いデモ本体だけを
 * 選択されたタイミングでクライアント側に読み込みます。
 */
export function Capabilities() {
  const [active, setActive] = useState(capabilities[0].slug);
  const current = capabilities.find((c) => c.slug === active) ?? capabilities[0];

  return (
    <Section id="capabilities">
      <SectionHeading
        eyebrow="Capabilities"
        title="こんなことが、できます"
        description="説明ではなく実物で。3DCG・アニメーション・AIチャットボット・SNS連携・システム連携のすべてを、このページ上で実際に動かして確かめられます。"
      />

      {/* できること一覧（説明は常にHTMLへ出力＝検索・AIが読める） */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.map((c, i) => {
          const isActive = c.slug === active;
          return (
            <article
              key={c.slug}
              className={`panel panel-hover flex flex-col p-5 text-left transition-all ${
                isActive ? "border-brand/60 shadow-[0_0_30px_-8px_rgba(34,211,238,0.45)]" : ""
              }`}
              data-reveal
              style={{ "--reveal-delay": `${i * 0.07}s` } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => setActive(c.slug)}
                aria-pressed={isActive}
                className="text-left"
              >
                <span
                  className={`grid size-11 place-items-center rounded-xl border transition-colors ${
                    isActive
                      ? "border-brand/50 bg-brand/15 text-brand-light shadow-[0_0_18px_rgba(34,211,238,0.3)]"
                      : "border-white/10 bg-white/5 text-slate-400"
                  }`}
                >
                  <Icon name={c.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.tagline}</p>
              </button>

              <div className="mt-4 flex flex-1 flex-col justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActive(c.slug)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    isActive ? "text-brand-light" : "text-slate-500 hover:text-brand-light"
                  }`}
                >
                  <Icon name="play" className="size-3.5" />
                  {isActive ? "下でデモを表示中" : "デモを見る"}
                </button>
                <Link
                  href={`/demo/${c.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-white"
                >
                  詳しい説明を読む
                  <Icon name="arrowRight" className="size-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* 選択中のデモ（その場で動きます） */}
      <div className="mt-10" data-reveal>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Live Demo</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{current.title}のデモ</h3>
          </div>
          <Link
            href={`/demo/${current.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light transition-colors hover:bg-gold/20"
          >
            {current.title}を詳しく見る
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        {/* slug をキーにして、切り替えのたびにデモを作り直す（状態の混線を防ぐ） */}
        <DemoLoader key={current.slug} slug={current.slug} />

        <p className="mt-4 rounded-xl border border-gold/25 bg-gold/[0.06] p-4 text-xs leading-relaxed text-slate-400">
          <span className="font-display mr-2 text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
            Note
          </span>
          {current.demoNote}
        </p>
      </div>
    </Section>
  );
}
