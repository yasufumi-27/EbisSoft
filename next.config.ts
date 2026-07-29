import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true のとき、GitHub Pages（https://<user>.github.io/EbisSoft/）向けの
 * 静的書き出し（output: "export"）＋サブパス設定に切り替える。
 * 通常のホスティング（Vercel等）ではこれまで通りサーバー配信＋セキュリティヘッダー。
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/EbisSoft";

/** 全ルートに付与するセキュリティ系ヘッダー（信頼性・安全性の向上）。 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // カメラ（ARの重ね合わせ）とマイク（音声AI）は自サイトのみ許可する。
    // 空の () にすると自サイトでも使えず、デモが Permissions policy violation で止まる。
    // 位置情報は使っていないため引き続き全面禁止。
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // レスポンスから X-Powered-By を除去
  poweredByHeader: false,
  // 末尾スラッシュなしのURLに統一（canonical との一貫性）
  trailingSlash: false,

  // ページ遷移をブラウザの View Transitions API でクロスフェードさせる
  experimental: {
    viewTransition: true,
  },

  // next/link を通さない生の <a href="/..."> 用。basePath をクライアントからも参照できるようにする
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? repoBasePath : "",
  },

  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: repoBasePath,
        assetPrefix: repoBasePath,
      }
    : {
        // headers() は静的書き出しでは使えないため通常ホスティング時のみ
        async headers() {
          return [
            {
              source: "/:path*",
              headers: securityHeaders,
            },
          ];
        },
      }),
};

export default nextConfig;
