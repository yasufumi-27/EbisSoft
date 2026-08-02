import { ImageResponse } from "next/og";

// output: "export"（GitHub Pages）でも静的生成できるよう明示
export const dynamic = "force-static";

// Apple Touch Icon（ホーム画面追加時のアイコン）
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * ホーム画面に置かれるサイズ（180px）では文字が読めるため、
 * ファビコンの "EB" ではなくロゴ本体（EBISU / SOFT）を2段で入れる。
 * 地色はブランドネイビー、アクセントはシアンのみ。グラデーション・影は使わない。
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f2e5f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#ffffff",
          }}
        >
          EBISU
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 6,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#22d3ee",
          }}
        >
          SOFT
        </div>
      </div>
    ),
    { ...size },
  );
}
