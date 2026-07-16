import type { Metadata, Viewport } from "next";
import { Geist, Orbitron } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BackgroundFx } from "@/components/fx/BackgroundFx";
import { RevealInit } from "@/components/fx/RevealInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// 見出し・数値・英字ラベル用の近未来ディスプレイフォント
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

/**
 * サイト全体のメタデータ。各ページはここを継承し、必要に応じて上書きします。
 * URL系フィールドは metadataBase を基準に絶対URL化されます。
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Web制作",
  // 正規URL（重複コンテンツ対策）。metadataBase と結合され絶対URLになる。
  alternates: {
    canonical: "/",
  },
  // 電話番号以外の自動リンク化を抑止（postalコード等の誤リンク防止）
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    // og:image は app/opengraph-image.tsx から自動付与されます
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    // twitter:image は app/twitter-image.tsx から自動付与されます
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },
  // Search Console の所有権確認トークンを環境変数から注入（未設定なら出力されません）
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#05070f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.lang}
      className={`${geistSans.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* JS無効環境でもコンテンツが見えるようにリビール演出を打ち消す */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;filter:none !important}`}</style>
        </noscript>
        {/* サイト共通の構造化データ（事業者・サイト） */}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {/* 3D背景（クライアントのみ・遅延読み込み）とスクロールリビール */}
        <BackgroundFx />
        <RevealInit />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
