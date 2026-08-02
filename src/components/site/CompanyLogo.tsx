import { siteConfig } from "@/lib/site";

/** ロゴ画像（透過処理済み）の置き場所。3D側（背景・デモ）からも参照します。 */
export const LOGO_IMAGE = {
  /** 表示用（976×781・WebP） */
  webp: "/logo/ebisu-soft-logo.webp",
  /** WebP非対応環境向けの控え（640×512・PNG） */
  png: "/logo/ebisu-soft-logo.png",
  /** 小さく出すとき＋Three.js のテクスチャ用（512×410・WebP） */
  texture: "/logo/ebisu-soft-logo-512.webp",
  width: 976,
  height: 781,
} as const;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * 会社ロゴ（シンボル画像）。背景を透過したPNG/WebPで、暗い背景にも白い紙にも同じように載ります。
 *
 * next/image を使っていないのは、
 * - 静的書き出し（output:"export"）では最適化が効かず素通しになる
 * - WebP と PNG を出し分ける <picture> を組みたい
 * ためです。寸法を固定して読み込み時のレイアウトずれ（CLS）を防いでいます。
 *
 * ヘッダー・フッターの小さな並び（`Logo.tsx`）は、極小サイズでも潰れない
 * フラットなワードマークのままにしています。こちらは「掲出用」の会社ロゴです。
 */
export function CompanyLogo({
  className = "",
  sizes = "(min-width: 1024px) 28rem, 90vw",
  priority = false,
}: {
  className?: string;
  /** 表示幅のヒント。小さく出す場所（フッター等）では "208px" のように渡して軽い方を選ばせる */
  sizes?: string;
  /** ページ上部に大きく出すときは true（遅延読み込みをやめる） */
  priority?: boolean;
}) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${BASE}${LOGO_IMAGE.texture} 512w, ${BASE}${LOGO_IMAGE.webp} 976w`}
        sizes={sizes}
      />
      <img
        src={`${BASE}${LOGO_IMAGE.png}`}
        width={LOGO_IMAGE.width}
        height={LOGO_IMAGE.height}
        alt={`${siteConfig.legalName}のロゴ`}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
