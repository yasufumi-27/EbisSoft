import { siteConfig } from "@/lib/site";

/**
 * ロゴ画像の置き場所。
 *
 * 画像は `src/components/fx/logo3d.ts` の**3Dモデルを書き出したもの**なので、
 * ヘッダーの静止画・サイト背景・3DCGデモがすべて同じ形をしています。
 * 背景は透過済み（暗い画面でも白い紙でもそのまま置けます）。
 */
export const LOGO_IMAGE = {
  /** 幅ごとのWebP（表示幅に応じてブラウザが選ぶ） */
  webp: [176, 352, 512, 976].map((w) => ({ w, src: `/logo/ebisu-soft-logo-3d-${w}.webp` })),
  /** WebP非対応環境向けの控え（640×640・PNG） */
  png: "/logo/ebisu-soft-logo-3d.png",
  /** 縦横比（正方形。レイアウトずれ＝CLS を防ぐために固定） */
  width: 1464,
  height: 1464,
} as const;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * 会社ロゴ（画像）。
 *
 * next/image を使っていないのは、
 * - 静的書き出し（output:"export"）では最適化が効かず素通しになる
 * - WebP と PNG を出し分ける <picture> を組みたい
 * ためです。
 *
 * ヘッダーは全ページで読み込むため、必ず `sizes` に実寸を渡してください
 * （176px版は約10KBです）。
 */
export function CompanyLogo({
  className = "",
  sizes = "(min-width: 1024px) 28rem, 90vw",
  priority = false,
  alt = `${siteConfig.legalName}のロゴ`,
}: {
  className?: string;
  /** 表示幅のヒント。小さく出す場所では "110px" のように渡して軽い方を選ばせる */
  sizes?: string;
  /** ページ上部に出すときは true（遅延読み込みをやめる） */
  priority?: boolean;
  /** 親側で社名を読み上げている場合（ヘッダーのロゴなど）は "" を渡して重複を避ける */
  alt?: string;
}) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={LOGO_IMAGE.webp.map((v) => `${BASE}${v.src} ${v.w}w`).join(", ")}
        sizes={sizes}
      />
      <img
        src={`${BASE}${LOGO_IMAGE.png}`}
        width={LOGO_IMAGE.width}
        height={LOGO_IMAGE.height}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
