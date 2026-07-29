import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

// output: "export"（GitHub Pages）でも静的生成できるよう明示
export const dynamic = "force-static";

// OG画像のメタデータ
export const alt = siteConfig.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * SNSシェア用OG画像を動的生成（ビルド時に静的最適化）。
 * satori の既定フォントは日本語グリフを持たないため、画像内テキストは
 * ラテン文字主体にして文字化けを防いでいます。
 */
export default function OgImage() {
  const host = siteConfig.url.replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #05070f 0%, #0a0e1d 55%, #101c33 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* ヘッダー：ロゴ */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            E
          </div>
          <div style={{ marginLeft: 24, fontSize: 38, fontWeight: 700 }}>EbisuSoft</div>
        </div>

        {/* 中央：キャッチ */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
            AI-driven web,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#22d3ee",
            }}
          >
            built fast. Built right.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 28, color: "#cbd5e1" }}>
            Web Studio in Fushimi, Kyoto — AI · 3DCG · Chatbot · Integration
          </div>
        </div>

        {/* フッター：URL・タグ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 25,
            color: "#94a3b8",
          }}
        >
          <div style={{ display: "flex" }}>{host}</div>
          <div style={{ display: "flex" }}>Live demos inside</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
