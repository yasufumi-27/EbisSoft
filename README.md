# EbisSoft — Web制作 集客サイト

Web制作（ホームページ制作）の**受注（集客）を目的としたサービスサイト**です。
「成果から逆算する」をコンセプトに、問い合わせ獲得に最適化したトップページを、
**SEO実装込み**で構築しています。

> ⚠️ **ブランド名「EbisSoft」はディレクトリ名からの仮称です。**
> 社名・連絡先・住所・ドメイン等は仮の値（`★`印）で入っています。
> 公開前に [`src/lib/site.ts`](src/lib/site.ts) と `.env.local` を実際の情報へ差し替えてください。

## 技術スタック

| 項目 | 採用技術 |
| --- | --- |
| フレームワーク | Next.js 16（App Router / Turbopack） |
| 言語 | TypeScript |
| UI | React 19 |
| スタイル | Tailwind CSS v4 |
| 画像生成 | `next/og`（OG画像・アイコンを動的生成） |
| フォーム | React Server Actions ＋ `useActionState` |

## セットアップ

```bash
npm install
cp .env.example .env.local   # 必要に応じて値を編集
npm run dev                  # http://localhost:3000
```

### スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー（要 build） |
| `npm run lint` | ESLint |

## ディレクトリ構成

```
src/
├ app/
│  ├ layout.tsx            # 全体メタデータ・viewport・共通JSON-LD（事業者/サイト）
│  ├ page.tsx             # トップページ（各セクション＋ページ固有JSON-LD）
│  ├ actions.ts          # お問い合わせのServer Action（★送信処理はTODO）
│  ├ contact-state.ts    # フォーム状態の型・初期値
│  ├ sitemap.ts          # /sitemap.xml
│  ├ robots.ts           # /robots.txt
│  ├ manifest.ts         # /manifest.webmanifest
│  ├ opengraph-image.tsx # /opengraph-image（SNSシェア画像を動的生成）
│  ├ twitter-image.tsx   # /twitter-image（OG画像を再利用）
│  ├ icon.svg            # ファビコン（SVG）
│  ├ apple-icon.tsx      # Apple Touch Icon（動的生成）
│  └ globals.css         # デザイントークン（ブランドカラー・フォント）
├ components/
│  ├ site/               # Header / Footer / Logo
│  ├ sections/           # Hero, Services, Works, Pricing, FAQ, Contact ...
│  ├ ui/                 # Container / Section / Button / icons
│  └ JsonLd.tsx          # 構造化データ描画
└ lib/
   ├ site.ts             # ★サイトの単一情報源（社名/URL/NAP/SNS など）
   ├ content.ts          # 掲載コンテンツ（サービス/料金/FAQ/実績…）
   └ jsonld.ts           # 構造化データのビルダー
```

## 実装済みのSEO対策

- **メタデータ**: タイトルテンプレート、ディスクリプション、キーワード、`canonical`（絶対URL）
- **OGP / Twitter Card**: `og:*` 一式、`summary_large_image`、画像は動的生成（`/opengraph-image`）
- **構造化データ（JSON-LD）**:
  - `ProfessionalService`（事業者・住所・電話・営業時間・評価）＋ `WebSite`
  - `BreadcrumbList`（パンくず）
  - `ItemList`（提供サービス）
  - `FAQPage`（FAQと内容同期）
- **クロール制御**: `robots.txt`、`sitemap.xml`、`robots` メタ（`max-image-preview:large` 等）
- **PWA**: `manifest.webmanifest`、各種アイコン、`theme-color`
- **パフォーマンス（Core Web Vitals）**: Webフォント最小化（ラテンのみ自己ホスト＋日本語はシステムフォント）、画像レス（CSS製ビジュアル）、静的プリレンダリング
- **セマンティクス / a11y**: 唯一の `<h1>`、見出し階層、`lang="ja"`、フォームのラベル/`aria-*`
- **セキュリティヘッダ**: `Strict-Transport-Security` / `X-Content-Type-Options` / `Referrer-Policy` ほか（[`next.config.ts`](next.config.ts)）

## 🚀 公開前チェックリスト

- [ ] [`src/lib/site.ts`](src/lib/site.ts) の `★` 印（社名・住所・電話・メール・SNS・設立日）を実情報に
- [ ] `.env.local` に本番ドメイン `NEXT_PUBLIC_SITE_URL` を設定
- [ ] Google Search Console の確認コード `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` を設定
- [ ] [`src/app/actions.ts`](src/app/actions.ts) の `TODO` に**実際の送信処理**（メール送信/CRM連携）を実装
- [ ] [`src/lib/content.ts`](src/lib/content.ts) のサンプル文言・実績・料金・お客様の声を差し替え
- [ ] `public/favicon.ico`（現状は仮）と `app/icon.svg` を正式ロゴに差し替え
- [ ] プライバシーポリシー・会社概要ページを作成し、フッターのリンクを接続
- [ ] （任意）OG画像に日本語を入れる場合は日本語フォント（例: Noto Sans JP）の `.ttf` を
      バンドルし、`app/opengraph-image.tsx` の `ImageResponse` に `fonts` を渡す
- [ ] Search Console へ `sitemap.xml` を送信

## カスタマイズ

- **ブランドカラー / フォント**: [`src/app/globals.css`](src/app/globals.css) の `@theme`（`--color-brand` ほか）
- **掲載内容**: [`src/lib/content.ts`](src/lib/content.ts)（UIと構造化データの両方に反映されます）
- **サイト情報**: [`src/lib/site.ts`](src/lib/site.ts)
