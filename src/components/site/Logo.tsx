import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { CompanyLogo } from "@/components/site/CompanyLogo";

/**
 * ロゴ（シンボル＋ワードマーク）。ヘッダー/フッターで共用。
 *
 * デザイン方針：
 * - シンボルは**依頼主提供の会社ロゴ画像**（背景を透過したWebP／`public/logo/`）。
 *   ヘッダーは全ページで読み込むため、`sizes` で最小の176px版（約21KB）だけを取りに行かせる。
 * - ワードマークは `EBISU`（白）＋ `SOFT`（シアン）。画像は小さいと文字が読めないため、
 *   社名が確実に伝わるよう文字は残す（画像だけにすると潰れて読めない）。
 * - 読み上げ・SEO上の社名は日本語の「エビスソフト」なので、リンクの aria-label で補い、
 *   画像側の alt は空にして重複読み上げを避ける。
 *
 * ※ ファビコン（`app/icon.svg` / `favicon.ico`）は16〜32pxで潰れないよう、
 *   引き続き `EB` の2文字マークのままです。
 */
export function Logo() {
  return (
    <Link
      prefetch={false}
      href="/"
      className="group inline-flex items-center whitespace-nowrap"
      aria-label={`${siteConfig.name} ホームへ`}
    >
      <CompanyLogo
        alt=""
        priority
        sizes="72px"
        className="mr-2 h-11 w-auto shrink-0 transition-[filter] group-hover:brightness-110 sm:mr-2.5 sm:h-14"
      />
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
