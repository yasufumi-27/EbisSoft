/**
 * サイト全体の単一情報源（Single Source of Truth）。
 * ドメイン・社名・NAP（社名/住所/電話）・SNS などはここだけ書き換えれば
 * メタデータ・構造化データ・sitemap・OG画像にすべて反映されます。
 *
 * 本番では NEXT_PUBLIC_SITE_URL を実ドメインに設定してください（.env 参照）。
 * ★印は仮の値です。公開前に実際の情報へ差し替えてください。
 */

const FALLBACK_URL = "https://www.ebissoft.co.jp"; // ★ 本番ドメインに差し替え

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  /** 表示用ブランド名 */
  name: "EbisSoft",
  /** 法人格つき正式名称 */
  legalName: "株式会社EbisSoft", // ★
  /** ふりがな・読み */
  reading: "エビスソフト",
  /** サイトのデフォルトタイトル（トップ） */
  title: "EbisSoft｜成果から逆算するホームページ制作・Webサイト制作会社",
  /** タイトルテンプレートの接尾辞 */
  titleTemplate: "%s｜EbisSoft",
  /** メタディスクリプション（120〜160字目安） */
  description:
    "EbisSoftは「成果から逆算する」Web制作会社です。コーポレートサイト・LP・ECサイトの制作から、SEO・AEO・LLMO（AI検索最適化）・表示速度改善・公開後の運用までワンストップ。検索エンジンにも生成AI（ChatGPT・AI Overviews等）にも“選ばれる”ホームページ制作をご提案します。",
  /** 公開URL（末尾スラッシュなし） */
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL),
  /** OGロケール */
  locale: "ja_JP",
  /** html lang */
  lang: "ja",
  /** 検索キーワード（メタkeywords。現在のSEO評価への寄与は小さいが付与） */
  keywords: [
    "ホームページ制作",
    "Web制作",
    "Webサイト制作",
    "Web制作会社",
    "コーポレートサイト制作",
    "LP制作",
    "ランディングページ制作",
    "ECサイト制作",
    "採用サイト制作",
    "サイトリニューアル",
    "SEO対策",
    "AEO",
    "LLMO",
    "AI検索最適化",
    "生成AIエンジン最適化",
    "AI Overviews 対策",
    "ChatGPT 検索 対策",
    "Web集客",
    "Next.js 制作",
  ],
  /** 連絡先・NAP（ローカルSEOで重要。表記揺れを作らないこと） */
  contact: {
    telephone: "+81-3-1234-5678", // ★ 国際表記
    telephoneDisplay: "03-1234-5678", // ★ 表示用
    email: "contact@ebissoft.co.jp", // ★
    address: {
      postalCode: "150-0013", // ★
      region: "東京都", // ★ 都道府県
      locality: "渋谷区", // ★ 市区町村
      street: "恵比寿1-2-3 EbisSoftビル 5F", // ★ 番地・建物
      country: "JP",
    },
    /** 営業時間（schema.org openingHours 形式 / 表示用） */
    openingHoursDisplay: "平日 10:00〜19:00",
    openingHours: "Mo-Fr 10:00-19:00",
  },
  /** 価格帯（schema.org priceRange） */
  priceRange: "¥¥",
  /** 対応エリア */
  areaServed: "日本全国（オンライン対応）",
  /** 専門領域。構造化データ knowsAbout に使用し、AI/LLMの「何の専門家か」理解を助ける */
  knowsAbout: [
    "ホームページ制作",
    "Webサイト制作",
    "コーポレートサイト制作",
    "ランディングページ制作",
    "ECサイト構築",
    "Webアプリ開発",
    "SEO対策",
    "AEO（Answer Engine Optimization）",
    "LLMO（LLM最適化）",
    "AI検索最適化",
    "Core Web Vitals 改善",
    "Web集客",
  ],
  /** 設立年月日（ISO） */
  foundingDate: "2018-04-01", // ★
  /** SNS・外部プロフィール（構造化データ sameAs に使用） */
  sameAs: [
    "https://x.com/ebissoft", // ★
    "https://www.facebook.com/ebissoft", // ★
    "https://www.instagram.com/ebissoft", // ★
    "https://github.com/ebissoft", // ★
  ],
  /** X(Twitter) ハンドル */
  twitterHandle: "@ebissoft", // ★
  /** OG画像の代替テキスト */
  ogImageAlt: "EbisSoft｜成果から逆算するWeb制作会社",
} as const;

export type SiteConfig = typeof siteConfig;

/** 絶対URLを生成するヘルパー */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
