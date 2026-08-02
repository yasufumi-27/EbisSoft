/**
 * サイト内AIアシスタントのドット絵キャラクター（16×16）。
 *
 * 画像ファイルは使わず、ドットの並びを文字列で持ってSVGの矩形に展開しています。
 *   - 追加のネットワーク取得が発生しない（初期表示に影響しない）
 *   - 拡大しても滲まない（shape-rendering: crispEdges）
 *   - 色をブランドカラーに合わせて1か所で変えられる
 *
 * 横に連続する同色ドットは1本の矩形にまとめているため、
 * 256個ではなく数十個の <rect> にしかなりません。
 */

/** ドットの記号 → 色。"." は透明（＝描画しない）。 */
const COLORS: Record<string, string> = {
  o: "#3c5580", // 輪郭（背景にも本体にも埋もれない中間色）
  b: "#e3ebf7", // 本体（明るいメタル）
  s: "#9fb0ca", // 陰
  v: "#08121f", // バイザー（暗い画面）
  e: "#22d3ee", // 目（点滅させるので別記号）
  c: "#22d3ee", // シアンのアクセント（アンテナ・口・胸）
};

/**
 * ドット絵の本体。1文字＝1ドット、16文字×16行。
 * 上からアンテナ → 頭（バイザーに目と口）→ 腕つきの胴体。
 */
const ART = [
  ".......oo.......",
  "......occo......",
  ".......oo.......",
  "..oooooooooooo..",
  ".obbbbbbbbbbbso.",
  ".oboooooooooobo.",
  ".oboveevveevobo.",
  ".oboveevveevobo.",
  ".obovvvvvvvvobo.",
  ".obovvccccvvobo.",
  ".oboooooooooobo.",
  ".obbbbbbbbbbbso.",
  "..oooooooooooo..",
  ".obobbbbbbbbobo.",
  ".obobbccccbbobo.",
  ".oooooooooooooo.",
];

const SIZE = 16;

type Run = { x: number; y: number; w: number; ch: string };

/** 横に連続する同色ドットを1本の矩形にまとめる。 */
function toRuns(rows: string[]): Run[] {
  const runs: Run[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === ".") {
        x += 1;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w += 1;
      runs.push({ x, y, w, ch });
      x += w;
    }
  });
  return runs;
}

const RUNS = toRuns(ART);
/** 目だけは別グループにして、まばたきのアニメーションを掛ける。 */
const EYE_RUNS = RUNS.filter((r) => r.ch === "e");
const BODY_RUNS = RUNS.filter((r) => r.ch !== "e");

export function PixelMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={`mascot ${className}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <g className="mascot-body">
        {BODY_RUNS.map((r) => (
          <rect
            key={`${r.x}-${r.y}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={1}
            fill={COLORS[r.ch]}
          />
        ))}
      </g>
      <g className="mascot-eyes">
        {EYE_RUNS.map((r) => (
          <rect
            key={`e-${r.x}-${r.y}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={1}
            fill={COLORS[r.ch]}
          />
        ))}
      </g>
    </svg>
  );
}
