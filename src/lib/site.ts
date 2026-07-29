/**
 * サイト全体の単一情報源（Single Source of Truth）。
 * ドメイン・社名・NAP（社名/住所/電話）・SNS などはここだけ書き換えれば
 * メタデータ・構造化データ・sitemap・OG画像にすべて反映されます。
 *
 * 本番では NEXT_PUBLIC_SITE_URL を実ドメインに設定してください（.env 参照）。
 * ★印は仮の値です。公開前に実際の情報へ差し替えてください。
 */

const FALLBACK_URL = "https://www.ebisusoft.co.jp"; // ★ 本番ドメインに差し替え

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  /** 表示用ブランド名 */
  name: "EbisuSoft",
  /** 法人格つき正式名称 */
  legalName: "株式会社EbisuSoft", // ★
  /** ふりがな・読み */
  reading: "エビスソフト",
  /** サイトのデフォルトタイトル（トップ） */
  title: "EbisuSoft｜AIで最速・高性能なホームページ制作（京都市伏見区）",
  /** タイトルテンプレートの接尾辞 */
  titleTemplate: "%s｜EbisuSoft",
  /** メタディスクリプション（120〜160字目安） */
  description:
    "EbisuSoftは京都市伏見区のAI活用型Web制作会社です。生成AIを制作フロー全体に組み込み、通常の数分の一の期間で高性能なサイトを構築。3DCG・WebGL演出、Webアニメーション、AIチャットボット、SNS連携、業務システム連携まで対応し、実際に動くデモをサイト内で公開しています。SEO・AEO・LLMO（AI検索最適化）にも特化。",
  /** 公開URL（末尾スラッシュなし） */
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL),
  /** OGロケール */
  locale: "ja_JP",
  /** html lang */
  lang: "ja",
  /** 検索キーワード（メタkeywords。現在のSEO評価への寄与は小さいが付与） */
  keywords: [
    "ホームページ制作 京都",
    "Web制作 京都",
    "ホームページ制作 伏見区",
    "Webサイト制作",
    "Web制作会社",
    "AI Web制作",
    "AI ホームページ制作",
    "AI開発 京都",
    "AIチャットボット 導入",
    "コーポレートサイト制作",
    "LP制作",
    "ECサイト制作",
    "サイトリニューアル",
    "SEO対策",
    "AEO",
    "LLMO",
    "AI検索最適化",
    "AI Overviews 対策",
    "ChatGPT 検索 対策",
    "Next.js 制作",
    "3DCG制作",
    "WebGL 制作",
    "Three.js 制作",
    "Webアニメーション制作",
    "SNS連携",
    "システム連携 API",
  ],
  /** 連絡先・NAP（ローカルSEOで重要。表記揺れを作らないこと） */
  contact: {
    telephone: "+81-75-123-4567", // ★ 国際表記
    telephoneDisplay: "075-123-4567", // ★ 表示用
    email: "contact@ebisusoft.co.jp", // ★
    address: {
      postalCode: "612-8083", // ★
      region: "京都府", // ★ 都道府県
      locality: "京都市伏見区", // ★ 市区町村
      street: "京町北8丁目1-2 EbisuSoftビル 3F", // ★ 番地・建物
      country: "JP",
    },
    /** 緯度・経度（LocalBusiness の geo。★実際の所在地に差し替え） */
    geo: { latitude: 34.9317, longitude: 135.7616 },
    /** 営業時間（schema.org openingHours 形式 / 表示用） */
    openingHoursDisplay: "平日 10:00〜19:00",
    openingHours: "Mo-Fr 10:00-19:00",
  },
  /** 価格帯（schema.org priceRange） */
  priceRange: "¥¥",
  /** 対応エリア（表示用） */
  areaServed: "京都・滋賀・大阪を中心に日本全国（オンライン対応）",
  /** 構造化データ areaServed 用の地域リスト（ローカルSEO） */
  areaServedList: ["京都市", "京都府", "滋賀県", "大阪府", "日本全国（オンライン）"],
  /** 重点的に対応する近隣エリア（ローカルSEOの内部表現） */
  localAreas: [
    "京都市伏見区",
    "京都市中京区",
    "京都市下京区",
    "京都市南区",
    "宇治市",
    "長岡京市",
    "大津市",
  ],
  /** 専門領域。構造化データ knowsAbout に使用し、AI/LLMの「何の専門家か」理解を助ける */
  knowsAbout: [
    "AIを活用したWeb制作",
    "生成AIによる開発自動化",
    "AIチャットボット開発",
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
    "3DCG制作",
    "WebGL / Three.js 演出",
    "Webアニメーション実装",
    "SNS連携・API連携",
    "業務システム連携",
  ],
  /** 設立年月日（ISO） */
  foundingDate: "2018-04-01", // ★
  /** SNS・外部プロフィール（構造化データ sameAs に使用） */
  sameAs: [
    "https://x.com/ebisusoft", // ★
    "https://www.facebook.com/ebisusoft", // ★
    "https://www.instagram.com/ebisusoft", // ★
    "https://github.com/ebisusoft", // ★
  ],
  /** X(Twitter) ハンドル */
  twitterHandle: "@ebisusoft", // ★
  /** OG画像の代替テキスト */
  ogImageAlt: "EbisuSoft｜AIで最速・高性能なWeb制作（京都市伏見区）",
} as const;

export type SiteConfig = typeof siteConfig;

/** 絶対URLを生成するヘルパー */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
