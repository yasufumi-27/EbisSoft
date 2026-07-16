"use client";

import dynamic from "next/dynamic";

// Three.js（約150KB）は初期表示のクリティカルパスから外し、
// クライアントでのみ遅延読み込みする（LCP/HTMLサイズへの影響ゼロ）。
const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });

/** 3D背景＋可読性を確保するオーバーレイ（ビネット／薄いグリッド）。 */
export function BackgroundFx() {
  return (
    <>
      <ThreeBackground />
      {/* 本文の可読性を上げるビネット（中央上部を暗く落とす） */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_0%,rgba(5,7,15,0.45)_55%,rgba(5,7,15,0.85)_100%)]"
      />
      {/* フィルムノイズの質感（ごく薄く重ねて安っぽいフラット感を消す） */}
      <div aria-hidden className="bg-noise pointer-events-none fixed inset-0 -z-10 opacity-[0.05]" />
    </>
  );
}
