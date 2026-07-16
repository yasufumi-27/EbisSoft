"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { nav } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";

/**
 * サイト共通ヘッダー。ダークガラス＋下辺の発光ライン。
 * スクロールすると背景の不透明度が上がり、コンテンツと干渉しない。
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors duration-500 ${
        scrolled || open ? "bg-ink/85" : "bg-ink/40"
      }`}
    >
      {/* 下辺の発光ライン */}
      <div aria-hidden className="divider-glow absolute inset-x-0 bottom-0" />

      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Logo />

        {/* デスクトップナビ：ホバーでシアンの下線が伸びる */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="グローバルナビゲーション">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative py-1 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-brand to-accent shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="#contact" withArrow>
            無料で相談する
          </ButtonLink>
        </div>

        {/* モバイル：ハンバーガー */}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* モバイルメニュー */}
      {open ? (
        <div id="mobile-menu" className="border-t border-white/10 bg-ink/95 backdrop-blur-xl md:hidden">
          <nav
            className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-6"
            aria-label="モバイルナビゲーション"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-brand-light"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href="#contact"
              withArrow
              className="mt-3 w-full"
              onClick={() => setOpen(false)}
            >
              無料で相談する
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
