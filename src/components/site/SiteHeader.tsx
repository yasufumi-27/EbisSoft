"use client";

import { useState } from "react";
import Link from "next/link";
import { nav } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";

/** サイト共通ヘッダー。デスクトップはインラインナビ、モバイルは開閉メニュー。 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Logo />

        {/* デスクトップナビ */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="グローバルナビゲーション">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand"
            >
              {item.label}
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
          className="inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
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
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <nav
            className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-6"
            aria-label="モバイルナビゲーション"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
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
