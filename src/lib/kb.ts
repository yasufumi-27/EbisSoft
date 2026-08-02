/**
 * サイト内AIチャットボットの「知識源」と「検索エンジン」。
 *
 * 本サイトは静的配信のため、デモのチャットボットはブラウザ内で完結します。
 * ここでは RAG（検索拡張生成）の前段にあたる **検索（Retrieval）** を実装しています。
 *   1. content.ts / site.ts の情報を知識ドキュメント（chunk）に変換
 *   2. 日本語向けに文字 N-gram（bi-gram）でトークン化
 *   3. BM25 でクエリとの関連度をスコアリング
 *   4. スコアが閾値未満なら「答えない」（＝ハルシネーション抑制）
 *
 * 実案件では 4 の後段に大規模言語モデル（Claude 等）を接続し、
 * 検索で得た根拠だけを使って自然文を生成させます。設計思想はこのデモと同じです。
 */

import { faqs, keyFacts, services, capabilities, plans, aiImpacts, businessLines } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export type KbDoc = {
  id: string;
  /** 出典の表示名 */
  source: string;
  /** 出典のカテゴリ */
  category: "FAQ" | "要点" | "サービス" | "できること" | "料金" | "会社情報" | "スピード";
  /** 検索対象テキスト（質問文・見出しなど） */
  key: string;
  /** 回答本文 */
  answer: string;
  /** 関連ページへのリンク（あれば） */
  href?: string;
};

/* ------------------------------------------------------------------
 * 1. 知識ドキュメントの構築
 * ---------------------------------------------------------------- */

function buildDocs(): KbDoc[] {
  const docs: KbDoc[] = [];

  faqs.forEach((f, i) => {
    docs.push({
      id: `faq-${i}`,
      source: f.question,
      category: "FAQ",
      key: f.question,
      answer: f.answer,
      href: "/faq",
    });
  });

  keyFacts.forEach((f, i) => {
    docs.push({
      id: `fact-${i}`,
      source: `要点：${f.q}`,
      category: "要点",
      key: f.q,
      answer: f.a,
    });
  });

  services.forEach((s) => {
    docs.push({
      id: `service-${s.slug}`,
      source: `サービス：${s.title}`,
      category: "サービス",
      key: `${s.title} ${s.features.join(" ")}`,
      answer: `${s.description}（主な内容：${s.features.join("／")}）`,
      href: "/web#services",
    });
  });

  businessLines.forEach((b, i) => {
    docs.push({
      id: `business-${i}`,
      source: `事業内容：${b.title}`,
      category: "サービス",
      key: `${b.title} 事業内容`,
      answer: b.description,
      href: b.category === "embedded" ? "/embedded#business" : "/web#business",
    });
  });

  capabilities.forEach((c) => {
    docs.push({
      id: `cap-${c.slug}`,
      source: `できること：${c.title}`,
      category: "できること",
      key: `${c.title} ${c.tagline} ${c.bullets.join(" ")} ${c.tech.join(" ")}`,
      answer: `${c.description}\n\n主にできること：${c.bullets.join("／")}\n実際に動くデモをご用意しています。`,
      href: `/demo/${c.slug}`,
    });
  });

  plans.forEach((p) => {
    docs.push({
      id: `plan-${p.name}`,
      source: `料金：${p.name}プラン`,
      category: "料金",
      key: `${p.name}プラン 料金 価格 費用 いくら 見積もり ${p.priceNote}`,
      answer: `${p.name}プランは ${p.price}（${p.priceNote}）です。${p.description} 含まれるもの：${p.features.join("／")}。初回のご相談・お見積もりは無料です。`,
      href: "/request#pricing",
    });
  });

  docs.push({
    id: "speed",
    source: "AI活用による制作スピード",
    category: "スピード",
    key: "納期 期間 スピード 速い 早い どれくらい 何日 いつ 完成 公開まで AI 短縮",
    answer: `AIを制作フロー全体に組み込むことで、制作期間は従来の約1/3になります。目安は次のとおりです。${aiImpacts
      .map((i) => `${i.label}：${i.before} → ${i.after}`)
      .join("／")}。`,
    href: "/ai#ai-power",
  });

  docs.push({
    id: "company",
    source: "会社情報（所在地・連絡先）",
    category: "会社情報",
    key: "会社 会社名 名称 屋号 所在地 住所 どこ 場所 京都 伏見 電話 連絡先 営業時間 アクセス エリア 対応地域 商工会 所属団体 加盟",
    answer: `${siteConfig.legalName}は${siteConfig.contact.address.region}${siteConfig.contact.address.locality}に拠点を置き、Web制作と組み込みソフトウェア開発を手がけています。所在地は〒${siteConfig.contact.address.postalCode} ${siteConfig.contact.address.region}${siteConfig.contact.address.locality}${siteConfig.contact.address.street}。${siteConfig.memberOf.map((m) => m.name).join("・")}に所属しています。対応エリアは${siteConfig.areaServed}です。`,
    href: "/company",
  });

  docs.push({
    id: "ai-strength",
    source: "AIへの強み",
    category: "要点",
    key: "AI 強い 得意 生成AI ChatGPT Claude 活用 自動化 エージェント LLM 機械学習",
    answer:
      "エビスソフトはAIを「使う側」と「作る側」の両方を手がけます。制作工程ではAIコーディングエージェントで実装を並列化して期間を約1/3に短縮し、納品物としてはRAG構成のAIチャットボットやAI機能の開発を行います。さらに、生成AIに引用・推薦されるためのAEO / LLMO最適化も内側から理解して実装します。",
    href: "/ai",
  });

  docs.push({
    id: "embedded",
    source: "組み込み・IoT開発",
    category: "サービス",
    key: "組み込み 組込み 組込 ファームウェア firmware マイコン 基板 デバイス 機器 iot センサー 制御 c言語 c++ stm32 esp32 arm cortex rtos ble bluetooth wi-fi mqtt uart i2c spi ハードウェア 電子機器",
    answer:
      "Web制作だけでなく、組み込みソフトウェア開発にも対応しています。マイコン（ARM Cortex-M・STM32・ESP32など）のファームウェアをC / C++で開発し、BLE・Wi-Fi・MQTT・UART・I2C・SPIの通信実装、センサー制御、省電力設計まで行います。取得データを表示する管理画面やクラウド連携も同じ体制で担当できるため、装置側とWeb側を別々の会社に発注する必要がありません。",
    href: "/embedded",
  });

  docs.push({
    id: "contact",
    source: "お問い合わせ方法",
    category: "会社情報",
    key: "問い合わせ 相談 依頼 発注 申し込み 無料 見積 連絡 したい",
    answer:
      "初回のご相談・お見積もりは無料です。お問い合わせページのフォーム、またはお電話・メールでご連絡ください。ご要望を伺ったうえで、構成案とお見積もりをご提示します。",
    href: "/contact",
  });

  // サイト内の案内（「どこに何が書いてあるか」を聞かれたときのための道案内）
  docs.push({
    id: "sitemap",
    source: "サイトの案内（ページ一覧）",
    category: "会社情報",
    key: "サイト ページ 一覧 どこ 見たい 探して メニュー 目次 案内 構成 リンク どのページ",
    answer:
      "このサイトは次のページで構成されています。\n・AI活用（/ai）… AIで作る／AI機能をつくる、AEO・LLMO対策\n・Web制作（/web）… サービス内容・制作の流れ\n・組み込み開発（/embedded）… ファームウェア・IoT連携\n・できること（/demo）… 実際に動くデモ15種\n・ご依頼・ご相談（/request）… 料金・お見積もり\n・よくある質問（/faq）／会社概要（/company）／お問い合わせ（/contact）\n気になるページがあれば、そのまま質問してください。",
    href: "/demo",
  });

  return docs;
}

export const kbDocs: KbDoc[] = buildDocs();

/* ------------------------------------------------------------------
 * 2. 日本語向けトークナイザ（文字 bi-gram ＋ 英数字の単語分割）
 * ---------------------------------------------------------------- */

/**
 * 表記ゆれを吸収する同義語展開（検索の再現率を上げる）。
 * キーは NFKC 正規化・小文字化した後の形で書きます。
 */
const SYNONYMS: [string, string][] = [
  ["値段", "料金 費用"],
  ["価格", "料金 費用"],
  ["費用", "料金"],
  ["いくら", "料金 費用"],
  ["コスト", "料金 費用"],
  ["予算", "料金 費用"],
  ["納期", "期間 スピード"],
  ["どれくらい", "期間"],
  ["どのくらい", "期間"],
  ["何日", "期間 日数"],
  ["速い", "期間 スピード"],
  ["早い", "期間 スピード"],
  ["3d", "3dcg 立体 webgl"],
  ["スリーディー", "3d 3dcg webgl"],
  ["ボット", "チャットボット ai"],
  ["bot", "チャットボット ai"],
  ["チャット", "チャットボット ai"],
  ["インスタ", "sns instagram"],
  ["ツイッター", "sns x twitter"],
  ["場所", "所在地 住所 京都"],
  ["どこ", "所在地 住所 京都"],
  ["住所", "所在地 京都 伏見"],
  ["連携", "連携 api システム"],
  ["アニメ", "アニメーション 動き"],
  ["動き", "アニメーション"],
  ["生成ai", "ai 生成AI"],
];

function normalize(text: string): string {
  const base = text.normalize("NFKC").toLowerCase();
  // 展開語がさらに別の同義語を呼ぶ連鎖を避けるため、判定は常に元の文字列に対して行う
  const expansions = SYNONYMS.filter(([from]) => base.includes(from)).map(([, to]) => to);
  return expansions.length ? `${base} ${expansions.join(" ")}` : base;
}

/** 記号・助詞のみの並びを除くための簡易ストップ文字 */
const STOP_CHARS = /[\s、。，．,.!?！？「」『』（）()【】・…ー~〜:：;；'"”“]/g;

export function tokenize(text: string): string[] {
  const norm = normalize(text).replace(STOP_CHARS, " ");
  const tokens: string[] = [];

  // 英数字は単語単位（3文字以上は前方一致の部分文字列も足して表記ゆれに強くする）
  for (const w of norm.split(/\s+/)) {
    if (!w) continue;
    if (/^[a-z0-9./+#-]+$/.test(w)) {
      tokens.push(w);
      continue;
    }
    // 日本語混じりは文字 bi-gram（1文字語も拾えるよう uni-gram も少量加える）
    const chars = Array.from(w);
    if (chars.length === 1) {
      tokens.push(chars[0]);
      continue;
    }
    for (let i = 0; i < chars.length - 1; i += 1) {
      tokens.push(chars[i] + chars[i + 1]);
    }
  }
  return tokens;
}

/* ------------------------------------------------------------------
 * 3. BM25 インデックス
 * ---------------------------------------------------------------- */

type IndexedDoc = {
  doc: KbDoc;
  tf: Map<string, number>;
  length: number;
};

const K1 = 1.4;
const B = 0.72;

function buildIndex(docs: KbDoc[]) {
  const indexed: IndexedDoc[] = docs.map((doc) => {
    // 検索対象は「key（質問・見出し）」を重めに、本文も含める
    const tokens = [...tokenize(doc.key), ...tokenize(doc.key), ...tokenize(doc.answer)];
    const tf = new Map<string, number>();
    tokens.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
    return { doc, tf, length: tokens.length };
  });

  const df = new Map<string, number>();
  indexed.forEach(({ tf }) => {
    tf.forEach((_, term) => df.set(term, (df.get(term) ?? 0) + 1));
  });

  const avgLength = indexed.reduce((sum, d) => sum + d.length, 0) / (indexed.length || 1);
  return { indexed, df, avgLength, total: indexed.length };
}

const INDEX = buildIndex(kbDocs);

export type SearchHit = {
  doc: KbDoc;
  score: number;
  /** 0〜1 に正規化した関連度（UI表示用） */
  relevance: number;
  /** スコアのうち「内容語」が占める割合（0〜1）。低いほど、てにをはだけで当たっている。 */
  focus: number;
};

/**
 * 内容語（＝そのトークンを含む文書が全体の何割以下なら“珍しい”とみなすか）。
 * 「ます」「すか」のような文末表現はほぼ全文書に現れるため、これで内容語と切り分けます。
 */
const CONTENT_TERM_DF_RATIO = 0.25;

/**
 * BM25 で知識ドキュメントを検索する。
 * @param query ユーザーの質問
 * @param topK 返す件数
 */
export function searchKb(query: string, topK = 3): SearchHit[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const contentDfLimit = INDEX.total * CONTENT_TERM_DF_RATIO;

  const scored = INDEX.indexed.map(({ doc, tf, length }) => {
    let score = 0;
    // 内容語だけで積んだスコア。全体に占める割合が focus。
    let contentScore = 0;
    for (const term of terms) {
      const f = tf.get(term);
      if (!f) continue;
      const n = INDEX.df.get(term) ?? 0;
      const idf = Math.log(1 + (INDEX.total - n + 0.5) / (n + 0.5));
      const denom = f + K1 * (1 - B + (B * length) / INDEX.avgLength);
      const part = idf * ((f * (K1 + 1)) / denom);
      score += part;
      if (n <= contentDfLimit) contentScore += part;
    }
    return { doc, score, focus: score > 0 ? contentScore / score : 0 };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.score ?? 0;

  return scored
    .filter((s) => s.score > 0)
    .slice(0, topK)
    .map((s) => ({
      ...s,
      relevance: best > 0 ? s.score / best : 0,
    }));
}

/**
 * 回答に足る関連度があるかの閾値。
 * これを下回る場合は「わからない」と答え、問い合わせへ誘導します（誤答の抑制）。
 *
 * 実測にもとづく値：想定質問（サジェスト18問）の最低スコアは 7.3 だったのに対し、
 * 無関係な質問（「明日の天気は？」）がたまたま1語だけ引っかかると 3.7 前後になる。
 * その間に置いた 6.0 を境界にしている。
 */
export const CONFIDENCE_THRESHOLD = 6.0;

/**
 * 回答してよいかの判定。
 *
 * BM25 のスコアだけで判定すると、「明日の天気は？」のような無関係な質問でも
 * 「〜ますか」「でき」といった文末・助動詞の bi-gram が積み上がって閾値を超え、
 * 見当違いのドキュメントを自信満々に返してしまいます（実測 3.72）。
 * そこで、スコアのうち内容語が占める割合（focus）が一定以上あることも条件にします。
 */
export const FOCUS_THRESHOLD = 0.4;

export function isConfident(hit: SearchHit | undefined): hit is SearchHit {
  return !!hit && hit.score >= CONFIDENCE_THRESHOLD && hit.focus >= FOCUS_THRESHOLD;
}

/** チャット欄に出すサジェスト質問 */
export const suggestedQuestions = [
  "AIを使うとどれくらい速いですか？",
  "料金の目安を教えてください",
  "3DCGでどんなことができますか？",
  "AIチャットボットは作れますか？",
  "会社はどこにありますか？",
  "既存システムと連携できますか？",
  "組み込み・IoTの開発もできますか？",
];
