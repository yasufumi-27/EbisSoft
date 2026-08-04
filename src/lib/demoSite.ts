/**
 * 職種別デモサイト（`/demosite/<職種>`）の型とテーマ。
 *
 * 【何を作っているか】
 * `/showcase/<職種>` が「この職種ならこの機能をこう使えます」という**説明**のページなのに対し、
 * `/demosite/<職種>` は**その職種のホームページそのもの**です。
 * ヘッダー・ヒーロー・サービス紹介・事例・お客様の声・料金・FAQ・アクセス・
 * 問い合わせフォーム・フッターまで、実際に納品するのと同じ構成で作ってあります。
 * WordPressのテーマデモと同じ位置づけで、**中身を触ることはできません**（見て確かめる用）。
 *
 * 【表示速度の約束（重要）】
 * - デモサイトは `app/(chrome)` の**外**にあります。当社のヘッダー・フッター・3D背景・
 *   常駐アシスタントのJSは**配信されません**。本サイト側も、別ページなので一切重くなりません。
 * - 別タブで開きます（`target="_blank"`）。リンクは `prefetch` しないため、
 *   **開いた瞬間に初めて**デモサイトのHTMLとCSSを取得します。
 * - サイト内の機能デモ（3D・AR・チャットボット等）は、**起動ボタンを押すまで読み込みません**。
 * - 見た目は Tailwind ではなく専用の `demosite.css`（数KB）で作っています。
 *   本サイトの暗いテーマと戦わずに、職種ごとの明るい配色へ切り替えるためです。
 *
 * 【正直さのルール】
 * 掲載している会社名・住所・電話番号・お客様の声は**すべて架空**です。
 * 実在の事業者と誤認されないよう、画面上部の帯とフッターで必ずその旨を出すこと。
 * ここに実在企業の名称・ロゴ・実績を書いてはいけません。
 */

import type { DemoSlug } from "@/lib/showcase";

/** 配色と字面のプリセット。職種の「らしさ」はほぼここで決まる */
export type DemoSiteTheme = "clean" | "warm" | "care" | "bold" | "elegant" | "trust";

export type DemoSiteData = {
  /** `showcaseData.ts` の職種スラッグと対応させる（メニューやデモの中身を引くため） */
  industry: string;
  /** 架空の屋号 */
  brand: string;
  /** ロゴの下に添える英字 */
  brandEn: string;
  /** ヘッダー右の一言（キャッチ） */
  brandNote: string;
  theme: DemoSiteTheme;
  /** ヒーローの大見出し（2行に割るため配列） */
  hero: string[];
  /** ヒーローのリード文 */
  lead: string;
  /** ヒーロー下の短い訴求（3つ） */
  heroPoints: string[];
  /** 主要導線のボタン名 */
  cta: { primary: string; secondary: string };
  /** 架空の連絡先 */
  tel: string;
  /** お知らせ（3件） */
  news: { date: string; tag: string; text: string }[];
  /** 選ばれる理由（3件） */
  reasons: { title: string; body: string }[];
  /** サービス一覧の呼び名（「診療案内」「メニュー」など職種の言葉にする） */
  menuTitle: string;
  menuLead: string;
  /** 事例セクションの呼び名（「施工事例」「症例」など） */
  worksTitle: string;
  worksLead: string;
  works: { tag: string; title: string; body: string }[];
  /** お客様の声（架空） */
  voices: { name: string; body: string }[];
  /** ご利用の流れ（4件） */
  flow: { title: string; body: string }[];
  /** よくある質問（4件） */
  faq: { q: string; a: string }[];
  /** アクセス・営業情報（架空） */
  info: { address: string; access: string; hours: string; closed: string; extra: string };
  /** 埋め込む機能デモの見せ方（`showcaseData` の picks から使うものを選ぶ） */
  featureLead: string;
};

/** 職種ページの picks からデモサイトに埋め込む数（多いと重くなるので上限を決めておく） */
export const MAX_SITE_DEMOS = 4;

/** デモサイトのナビゲーション（全職種共通の並び。名前だけ職種語に差し替える） */
export function demoSiteNav(d: DemoSiteData): { id: string; label: string }[] {
  return [
    { id: "about", label: "特徴" },
    { id: "menu", label: d.menuTitle },
    { id: "feature", label: "できること" },
    { id: "works", label: d.worksTitle },
    { id: "faq", label: "よくある質問" },
    { id: "access", label: "アクセス" },
  ];
}

/** 機能デモの識別子（型を再輸出して、デモサイト側から showcase.ts を直接読まなくてよくする） */
export type { DemoSlug };
