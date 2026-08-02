import { siteConfig } from "@/lib/site";

/** ロゴ画像（透過処理済み）の置き場所。3D側（背景・デモ）からも参照します。 */
export const LOGO_IMAGE = {
  /** ヘッダー用（176×141・WebP） */
  xs: "/logo/ebisu-soft-logo-176.webp",
  /** ヘッダーの高解像度ディスプレイ用（352×282・WebP） */
  sm: "/logo/ebisu-soft-logo-352.webp",
  /** Three.js のテクスチャ用（512×410・WebP） */
  texture: "/logo/ebisu-soft-logo-512.webp",
  /** 大きく出すとき（976×781・WebP） */
  webp: "/logo/ebisu-soft-logo.webp",
  /** WebP非対応環境向けの控え（640×512・PNG） */
  png: "/logo/ebisu-soft-logo.png",
  width: 976,
  height: 781,
} as const;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * 会社ロゴ（画像）。背景を透過したPNG/WebPで、暗い背景にも白い紙にも同じように載ります。
 *
 * next/image を使っていないのは、
 * - 静的書き出し（output:"export"）では最適化が効かず素通しになる
 * - WebP と PNG を出し分ける <picture> を組みたい
 * ためです。寸法比を固定して読み込み時のレイアウトずれ（CLS）を防いでいます。
 *
 * `sizes` で表示幅を伝えると、176 / 352 / 512 / 976px の中から必要なものだけを取りに行きます。
 * ヘッダーは全ページで読み込むため、必ず小さい幅を渡してください（176px版は約21KB）。
 */
export function CompanyLogo({
  className = "",
  sizes = "(min-width: 1024px) 28rem, 90vw",
  priority = false,
  alt = `${siteConfig.legalName}のロゴ`,
}: {
  className?: string;
  /** 表示幅のヒント。小さく出す場所では "56px" のように渡して軽い方を選ばせる */
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
        srcSet={[
          `${BASE}${LOGO_IMAGE.xs} 176w`,
          `${BASE}${LOGO_IMAGE.sm} 352w`,
          `${BASE}${LOGO_IMAGE.texture} 512w`,
          `${BASE}${LOGO_IMAGE.webp} 976w`,
        ].join(", ")}
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
