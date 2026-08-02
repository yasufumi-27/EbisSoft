import { Fragment } from "react";

/**
 * 日本語の組版ヘルパー。
 *
 * ブラウザは日本語を「どの文字の間でも折り返してよい」と扱うため、
 * カタカナ語が「チャット／ボット」「シミュレー／ター」のように語の途中で切れます。
 * 読み手には誤字のように見えるので、カタカナの連なりを .nb で包んで
 * 語の内部で折り返さないようにします（CSSは globals.css の `.nb`）。
 *
 * - サーバー側で組み立てるだけなので、クライアントJSは増えません。
 * - 文字は一切足さない（U+2060 等を挟まない）ため、コピー・読み上げ・
 *   検索エンジンの読み取りには影響しません。
 * - 1行に収まらないほど長い語は、`.nb` 側の overflow-wrap で例外的に折り返します。
 */

/**
 * 折り返したくない語のパターン。
 * 1. スラッシュで並べた略語（SEO / AEO / LLMO、BLE / Wi-Fi / MQTT）。
 *    区切りの前後で改行されると「（AEO /」で行が終わり「LLMO）」だけが次の行に残る。
 * 2. ハイフン・ドット・スラッシュでつながる英数字（Wi-Fi / N-gram / llms.txt / Three.js）。
 *    これらの記号の直後はブラウザが改行可能とみなすため、語が割れてしまう。
 * 3. カタカナ（小書き・ヴ含む）と長音記号の連なり。中黒（・）は区切りなので含めない。
 *    直前・直後に続く英数字も一続きの語として扱う（AIチャットボット・PWA対応の「AI」など。
 *    別々に包むと、その境目で改行できてしまい「AI／チャットボット」と割れる）。
 */
const KATAKANA_RUN =
  /[A-Za-z][A-Za-z0-9+#]*(?: \/ [A-Za-z0-9+#]+)+|[A-Za-z][A-Za-z0-9+#]*(?:[-./][A-Za-z0-9+#]+)+|[A-Za-z0-9]*[ァ-ヺー]{2,}[A-Za-z0-9]*/g;

/**
 * これより長い語は、包むと狭い画面で行から溢れるため、そのままにする。
 * 英数字は全角のおよそ半分の幅なので、上限も倍に取る。
 */
const MAX_KATAKANA = 14;
const MAX_LATIN = 20;

/** 文字列中のカタカナ語を、折り返し禁止の span で包んで返します。 */
export function ja(text: string): React.ReactNode {
  if (!text) return text;

  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  KATAKANA_RUN.lastIndex = 0;

  while ((match = KATAKANA_RUN.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const word = match[0];
    const hasKatakana = /[ァ-ヺー]/.test(word);
    if (word.length > (hasKatakana ? MAX_KATAKANA : MAX_LATIN)) {
      parts.push(word); // 長すぎるものは固定すると溢れるので、そのまま
    } else {
      parts.push(
        <span key={`${match.index}-${word}`} className={hasKatakana ? "nb" : "nb-strict"}>
          {word}
        </span>,
      );
    }
    last = match.index + word.length;
  }

  // カタカナが1つもなければ、余計なノードを作らずそのまま返す
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));

  return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
}

/**
 * ReactNode 版。文字列ならカタカナ語を保護し、要素ならそのまま返します。
 * 見出しなどに `<span>` 混じりの JSX を受け取る共通コンポーネントで使います。
 */
export function jaNode(node: React.ReactNode): React.ReactNode {
  return typeof node === "string" ? ja(node) : node;
}
