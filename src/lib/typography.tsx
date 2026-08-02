import { Fragment } from "react";

/**
 * 日本語の組版ヘルパー。
 *
 * ブラウザは日本語を「どの文字の間でも折り返してよい」と扱うため、放っておくと
 * 「チャット／ボット」「従／来」「所／属」のように語の途中で切れます。
 * 読み手には誤字のように見えるので、語のまとまりを .nb で包んで
 * 語の内部で折り返さないようにします（CSSは globals.css の `.nb`）。
 *
 * CSS の `word-break: auto-phrase`（文節での折り返し）は当てにできません。
 * `CSS.supports()` は true を返すのに、実際の折り返し位置は何も変わらず、
 * カタカナすら途中で割れることを実測で確認しています（2026-08-03）。
 * そのため、守る語はここ（サーバー側）で決めます。
 *
 * - サーバー側で組み立てるだけなので、クライアントJSは増えません。
 * - 文字は一切足さない（U+2060 等を挟まない）ため、コピー・読み上げ・
 *   検索エンジンの読み取りには影響しません。
 * - ひらがなは包みません。すべて包むと折り返せる場所がなくなって行が溢れるうえ、
 *   ひらがなの途中で折り返すのは日本語の組版として珍しくないためです。
 */

/**
 * 折り返したくない語のパターン。左から順に試されるので、長いものを先に置くこと。
 *
 * 1. スラッシュで並べた略語（SEO / AEO / LLMO、BLE / Wi-Fi / MQTT）。
 *    区切りの前後で改行されると「（AEO /」で行が終わり「LLMO）」だけが次の行に残る。
 * 2. ハイフン・ドット・スラッシュでつながる英数字（Wi-Fi / N-gram / llms.txt / Three.js）。
 *    これらの記号の直後はブラウザが改行可能とみなすため、語が割れてしまう。
 * 3. カタカナ（小書き・ヴ含む）と長音記号の連なり。中黒（・）は区切りなので含めない。
 *    直前・直後に続く英数字も一続きの語として扱う（AIチャットボット・PWA対応の「AI」など。
 *    別々に包むと、その境目で改行できてしまい「AI／チャットボット」と割れる）。
 * 4. 数量と単位（298,000円／約1/3／最短5日／3〜4週間／15領域）。
 *    数字の直後の漢字は単位・助数詞とみなして一続きにする。
 * 5. 漢字の連なり（熟語）。「従来」「所属」「管理画面」「全体像」が割れるのを防ぐ。
 */
const PROTECTED_WORD = new RegExp(
  [
    "[A-Za-z][A-Za-z0-9+#]*(?: / [A-Za-z0-9+#]+)+",
    "[A-Za-z][A-Za-z0-9+#]*(?:[-./][A-Za-z0-9+#]+)+",
    "[A-Za-z0-9]*[ァ-ヺー]{2,}[A-Za-z0-9]*",
    "[0-9][0-9,./〜～-]*[一-鿿々]{0,3}",
    "[一-鿿々]{2,}",
  ].join("|"),
  "g",
);

/**
 * これより長い語は、包むと狭い画面で行から溢れるため、そのままにする。
 * 全角（漢字・カタカナ）と半角（英数字）で見た目の幅が倍ちがうので、上限も分ける。
 */
const MAX_KANJI = 6;
const MAX_KATAKANA = 14;
const MAX_LATIN = 20;

/** 語の種類ごとの上限。長すぎる語は包まない（狭い画面での溢れを防ぐ）。 */
function fitsInLine(word: string) {
  if (/[ァ-ヺー]/.test(word)) return word.length <= MAX_KATAKANA;
  // 数量（半角数字が主体）は全角より狭いので、漢字より少し余裕を持たせる
  if (/^[0-9]/.test(word)) return word.length <= MAX_LATIN;
  if (/[一-鿿々]/.test(word)) return word.length <= MAX_KANJI;
  return word.length <= MAX_LATIN;
}

/** 文字列中の「割れると読みにくい語」を、折り返し禁止の span で包んで返します。 */
export function ja(text: string): React.ReactNode {
  if (!text) return text;

  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  PROTECTED_WORD.lastIndex = 0;

  while ((match = PROTECTED_WORD.exec(text)) !== null) {
    const word = match[0];
    // 1文字だけの語（漢字1字＋助数詞なしなど）は割れようがないので包まない
    if (word.length < 2 || !fitsInLine(word)) continue;
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span key={`${match.index}-${word}`} className="nb">
        {word}
      </span>,
    );
    last = match.index + word.length;
  }

  // 守る語が1つもなければ、余計なノードを作らずそのまま返す
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));

  return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
}

/**
 * ReactNode 版。文字列なら語を保護し、要素ならそのまま返します。
 * 見出しなどに `<span>` 混じりの JSX を受け取る共通コンポーネントで使います。
 */
export function jaNode(node: React.ReactNode): React.ReactNode {
  return typeof node === "string" ? ja(node) : node;
}
