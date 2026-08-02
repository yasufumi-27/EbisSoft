/**
 * サイト内AIアシスタントのドット絵ロボット。
 *
 * 画像ファイルは使わず、ドットの並びを文字列で持ってSVGの矩形に展開しています。
 *   - 追加のネットワーク取得が発生しない（初期表示に影響しない）
 *   - 拡大しても滲まない（shape-rendering: crispEdges）
 *   - 色をブランドカラーに合わせて1か所で変えられる
 *
 * 横に連続する同色ドットは1本の矩形にまとめているため、
 * 数百個ではなく数十個の <rect> にしかなりません。
 *
 * 2種類の絵を持ちます。
 *   full … 全身（右下の起動ボタン用。輪郭そのものがボタンになる）
 *   head … 顔まわりだけ（チャット内のアイコン用。小さくても潰れない）
 * どちらも「正面よりわずかに左を向いている」構図で、
 * 目を左寄せ・アンテナを左側に付けることで向きを出しています。
 */

/** ドットの記号 → 色。"." は透明（＝描画しない）。 */
const COLORS: Record<string, string> = {
  o: "#3c5580", // 輪郭（背景にも本体にも埋もれない中間色）
  b: "#e3ebf7", // 本体（明るいメタル）
  s: "#9fb0ca", // 陰（右側に置いて立体感を出す）
  v: "#08121f", // バイザー（暗い画面）
  e: "#22d3ee", // 目（点滅させるので別記号）
  c: "#22d3ee", // シアンのアクセント（アンテナ・口・胸のモニタ・手）
  a: "#e2c078", // 金のアクセント（胸のランプ）
};

/**
 * 全身（18×24）。上からアンテナ → 頭 → 首 → 腕つきの胴体 → 脚 → 足。
 * 頭と胴体をわずかに左へ寄せ、目も左寄せにして「少し左向き」にしています。
 */
const ART_FULL = [
  "....cc............",
  ".....o............",
  ".....o............",
  "..oooooooooooo....",
  "..obbbbbbbbbso....",
  "..obvvvvvvvvso....",
  "..obeevveevvso....",
  "..obeevveevvso....",
  "..obvvvvvvvvso....",
  "..obvccccvvvso....",
  "..obvvvvvvvvso....",
  "..obbbbbbbbbso....",
  "..oooooooooooo....",
  "......obbo........",
  "...oooooooooo.....",
  ".oboobbbbbbbbobo..",
  ".oboobccccbabobo..",
  ".oboobccccbbsobo..",
  ".ccobbbbbbbsocc...",
  "...obbbbbbbso.....",
  "...oooooooooo.....",
  "....obo...obo.....",
  "....obo...obo.....",
  "...ooooo.ooooo....",
];

/** 顔まわりだけ（16×16）。チャット内の小さなアイコン用。 */
const ART_HEAD = [
  ".....cc.........",
  "......o.........",
  "......o.........",
  ".oooooooooooooo.",
  ".obbbbbbbbbbbso.",
  ".obvvvvvvvvvvso.",
  ".obeevveevvvvso.",
  ".obeevveevvvvso.",
  ".obvvvvvvvvvvso.",
  ".obvccccvvvvvso.",
  ".obvvvvvvvvvvso.",
  ".obbbbbbbbbbbso.",
  ".oooooooooooooo.",
  "......obbo......",
  "..oooooooooooo..",
  ".obbbbbbbbbbbbo.",
];

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

type Art = {
  width: number;
  height: number;
  /** 目以外（まばたきさせないもの） */
  body: Run[];
  /** 目だけ別グループにして、まばたきのアニメーションを掛ける */
  eyes: Run[];
};

function buildArt(rows: string[]): Art {
  const runs = toRuns(rows);
  return {
    width: rows[0].length,
    height: rows.length,
    body: runs.filter((r) => r.ch !== "e"),
    eyes: runs.filter((r) => r.ch === "e"),
  };
}

const ARTS: Record<"full" | "head", Art> = {
  full: buildArt(ART_FULL),
  head: buildArt(ART_HEAD),
};

export function PixelMascot({
  className = "",
  variant = "head",
}: {
  className?: string;
  /** full＝全身（起動ボタン）／head＝顔まわり（チャット内アイコン） */
  variant?: "full" | "head";
}) {
  const art = ARTS[variant];
  return (
    <svg
      viewBox={`0 0 ${art.width} ${art.height}`}
      className={`mascot ${className}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <g className="mascot-body">
        {art.body.map((r) => (
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
        {art.eyes.map((r) => (
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
