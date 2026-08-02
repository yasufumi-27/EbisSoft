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
 * - シンボルは E 一文字ではなく EBISU の語そのもの。小サイズ用（ファビコン等）だけ
 *   `app/icon.svg` の "EB" マークに縮める。
 *
 * 読み上げ・SEO上の社名は日本語の「エビスソフト」のままなので、aria-label で補う。
 */
export function Logo() {
  return (
    <Link
      prefetch={false}
      href="/"
      className="group inline-flex items-center whitespace-nowrap"
      aria-label={`${siteConfig.name} ホームへ`}
    >
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
