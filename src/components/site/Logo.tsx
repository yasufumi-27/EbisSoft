import Link from "next/link";
import { siteConfig } from "@/lib/site";

/**
 * ロゴ（ワードマーク）。ヘッダー/フッターで共用。
 *
 * デザイン方針（2026-08-03 リニューアル）：
 * - 旧ロゴの3D文字・グラデーション・影・楕円リングは廃止し、フラットな文字ロゴに統一。
 * - 20年以上の認知がある **EBISU** の綴りは残す（実績の継承）。
 * - 「SOFT」だけをシアンにして、堅実なベース＋一点の進化、という関係で見せる。
 *   AIを直接表すモチーフ（脳・回路・ロボット）は使わない。
 * - シンボルは E 一文字ではなく EBISU の綴りに由来する "EB" マーク（`app/icon.svg` と同じ図形）。
 *   ワードマークだけだと見出しの文字と区別がつかないため、会社ロゴとしてマークを必ず伴わせる。
 *
 * 読み上げ・SEO上の社名は日本語の「エビスソフト」のままなので、aria-label で補う。
 */
/**
 * シンボルマーク（角丸スクエア＋EB）。`app/icon.svg`（ファビコン）と同じ図形です。
 * 見出しの文字と混ざらないよう、ロゴだけは常にこのマークを伴わせます。
 * 図形はインラインSVG＝追加の読み込みなし・どの倍率でも滲みません。
 */
function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <rect width="64" height="64" rx="14" fill="#0f2e5f" />
      <g fill="#ffffff">
        <rect x="9" y="17" width="6" height="30" />
        <rect x="9" y="17" width="16" height="6" />
        <rect x="9" y="41" width="16" height="6" />
      </g>
      <rect x="9" y="29" width="13" height="6" fill="#22d3ee" />
      <g fill="none" stroke="#ffffff" strokeWidth="6">
        <path d="M34 17V47" />
        <path d="M34 20h11.5a6 6 0 0 1 0 12H34" />
        <path d="M34 32h13a6 6 0 0 1 0 12H34" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      prefetch={false}
      href="/"
      className="group inline-flex items-center whitespace-nowrap"
      aria-label={`${siteConfig.name} ホームへ`}
    >
      <LogoMark className="mr-2.5 size-9 shrink-0 rounded-[0.5rem] ring-1 ring-white/10 transition-shadow group-hover:ring-brand/50" />
      <span
        aria-hidden
        className="text-lg font-extrabold tracking-[0.1em] text-white transition-colors group-hover:text-brand-light sm:text-xl"
      >
        EBISU
      </span>
      <span
        aria-hidden
        className="ml-2 text-lg font-extrabold tracking-[0.1em] text-brand sm:text-xl"
      >
        SOFT
      </span>
    </Link>
  );
}
