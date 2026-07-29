/**
 * サイトの掲載コンテンツの単一情報源。
 * FAQ・サービス・できること（デモ）などは UI と JSON-LD（構造化データ）の双方から
 * 参照するため、ここに集約して内容の食い違いを防ぎます。
 */

import type { IconKey } from "@/components/ui/icons";

export type NavItem = { label: string; href: string };
export const nav: NavItem[] = [
  { label: "AI活用", href: "/#ai-power" },
  { label: "できること", href: "/#capabilities" },
  { label: "サービス", href: "/#services" },
  { label: "AI検索対策", href: "/#ai-search" },
  { label: "料金", href: "/#pricing" },
  { label: "よくある質問", href: "/#faq" },
];

export type Stat = { value: string; label: string };
export const stats: Stat[] = [
  { value: "100点", label: "Lighthouse 性能スコア" },
  { value: "最短5日", label: "公開までの最短日数" },
  { value: "1/3", label: "AI活用で短縮した制作期間" },
  { value: "1時間", label: "実動デモ5種の実装時間（合計）" },
];

/* ------------------------------------------------------------------
 * できること（Capabilities）＝ 実際に動くデモを用意した得意領域。
 * トップの一覧カードと /demo 配下の各ページの双方から参照します。
 * ---------------------------------------------------------------- */

export type Capability = {
  /** URL スラッグ（/demo/<slug>） */
  slug: string;
  /** 見出し */
  title: string;
  /** 一覧カード用の短い説明（1行） */
  tagline: string;
  /**
   * カードで太字表示する「事業へのインパクト」1行。
   * 技術の説明ではなく、導入すると会社の何が変わるかを書く。
   */
  impact: string;
  /** 詳細ページ・構造化データ用の説明（3行以内） */
  description: string;
  icon: IconKey;
  /** カードのビジュアル用グラデーション（Tailwind クラス） */
  gradient: string;
  /** 導入すると何が起きるか（企業側のメリット） */
  businessValue: { title: string; body: string }[];
  /** このデモをAIを活用して実装するのに要した時間 */
  buildTime: string;
  /** できることの箇条書き */
  bullets: string[];
  /** 使用技術 */
  tech: string[];
  /** 活用シーン */
  useCases: string[];
  /**
   * デモの範囲と制約（誠実さ＝E-E-A-Tの Trust）。
   * 「どこまでが実装で、本番では何が変わるか」を必ず明示します。
   */
  demoNote: string;
  /** デモの操作説明 */
  howToUse: string[];
};

export const capabilities: Capability[] = [
  {
    slug: "3dcg",
    title: "3DCG・WebGL演出",
    tagline: "製品を、持ち込まずに見せる。",
    impact: "現物を送らなくても、質感・サイズ・全カラーが伝わる。",
    description:
      "Three.js / WebGL で、ブラウザ上を回せる3D製品ビューアやブランド演出を実装します。写真では伝わらない立体感を、スマートフォンでも滑らかに動く軽さで届けます。",
    icon: "cube",
    gradient: "from-cyan-500 via-sky-500 to-violet-500",
    businessValue: [
      {
        title: "商談が「買うかどうか」から始まる",
        body: "形状・質感・サイズ感の疑問がサイト上で解消されるため、問い合わせてくる時点で検討が進んでいます。展示会や現物の郵送に頼らず、遠方の見込み客にも同じ体験を届けられます。",
      },
      {
        title: "撮影コストが一度きりで済む",
        body: "3Dモデルを1つ作れば、全カラー・全角度・どんな背景でも書き出せます。色数の多い製品ほど、カタログ撮影の費用と期間を圧縮できます。",
      },
      {
        title: "「安く見えない」が価格を守る",
        body: "動く3Dは、それだけで技術力と資本力の証明になります。相見積もりで価格だけを比較される状況から抜けやすくなります。",
      },
    ],
    buildTime: "約15分",
    bullets: [
      "製品の360度ビューア（回転・ズーム・カラー変更）",
      "ブランドシンボルやヒーローの3D演出",
      "建築・空間のウォークスルー、地図・データの3D可視化",
      "スマホでも滑らかに動く軽量化（LOD・圧縮テクスチャ）",
    ],
    tech: ["Three.js", "WebGL", "GLSL", "glTF / Draco圧縮", "React Three Fiber"],
    useCases: [
      "現物を持ち運べない大型・高額製品のメーカー",
      "カラーバリエーションが多い製品のEC",
      "間取り・設備を立体で伝えたい不動産・建築",
    ],
    demoNote:
      "このデモは実際に WebGL でリアルタイム描画しています（動画ではありません）。ジオメトリ・マテリアル・ライティングをその場で切り替えられます。実案件では、お客様の製品データ（CAD / glTF）を読み込んで同じ仕組みで実装します。",
    howToUse: [
      "ドラッグで回転、ホイール／ピンチでズーム",
      "形状・素材・カラーをボタンで切り替え",
      "自動回転や光の強さもその場で変更できます",
    ],
  },
  {
    slug: "animation",
    title: "Web内アニメーション",
    tagline: "読まれない説明を、見てもらえる情報に。",
    impact: "複雑なサービスが数秒で伝わり、離脱が止まる。",
    description:
      "スクロール連動の演出、図解アニメーション、操作に反応するマイクロインタラクションを設計・実装します。装飾ではなく、視線を導き、理解を助けるための動きです。",
    icon: "sparkles",
    gradient: "from-violet-500 via-fuchsia-500 to-amber-400",
    businessValue: [
      {
        title: "文章では読まれない仕組みが伝わる",
        body: "「何をしてくれる会社か分かりにくい」商材ほど効きます。図が順に組み上がる演出は、長文の説明より速く、正確に理解されます。",
      },
      {
        title: "滞在時間が伸び、離脱が減る",
        body: "スクロールするたびに変化があるページは、途中で閉じられにくくなります。最後のCTAまで読み進めてもらえる確率が上がります。",
      },
      {
        title: "ブランドの格が上がる",
        body: "操作に対する反応の丁寧さは、そのまま「仕事の丁寧さ」として受け取られます。単価の高い商材ほど、体験の質が信頼に直結します。",
      },
    ],
    buildTime: "約10分",
    bullets: [
      "スクロール連動のパララックス・リビール演出",
      "SVGのパス描画・モーフィングアニメーション",
      "テキストのスクランブル／分解／グラデーション演出",
      "ボタンやカードのマイクロインタラクション",
      "prefers-reduced-motion に対応したアクセシブルな実装",
    ],
    tech: [
      "CSS Animations / Transitions",
      "Web Animations API",
      "IntersectionObserver",
      "SVG SMIL・stroke-dasharray",
      "GSAP・Framer Motion（案件に応じて）",
    ],
    useCases: [
      "仕組みの説明が難しいBtoB・SaaS",
      "スクロールで物語を伝えるブランドサイト・LP",
      "操作感を高めたいWebアプリ・予約システム",
    ],
    demoNote:
      "ここに並んでいる8つは、すべてこのページ上で実際に動いているアニメーションです。外部のアニメーションライブラリを使わず、CSS と Web Animations API のみで実装しています（＝追加のJavaScriptを読み込まないため、表示速度に影響しません）。",
    howToUse: [
      "各パネルにマウスを乗せる／タップすると反応します",
      "スクロールすると連動して変化する演出もあります",
      "OSで「視差効果を減らす」を有効にしている場合、動きは自動的に抑制されます",
    ],
  },
  {
    slug: "ai-chatbot",
    title: "AIチャットボット",
    tagline: "夜間・休日の問い合わせを、取りこぼさない。",
    impact: "定型質問の一次対応が自動化され、人を増やさず窓口が24時間になる。",
    description:
      "自社の資料・FAQ・サービス情報を知識源に、訪問者の質問へ自動で答えるAIを構築します。根拠を示し、知識源にないことは答えない設計で、誤回答のリスクを抑えます。",
    icon: "chat",
    gradient: "from-emerald-500 via-teal-400 to-cyan-400",
    businessValue: [
      {
        title: "検討が止まる瞬間をなくす",
        body: "問い合わせの多くは営業時間外に発生します。「料金は？」「うちの規模でも使える？」に即答できれば、翌営業日まで待たされて他社に流れる離脱を防げます。",
      },
      {
        title: "同じ質問に答える時間が消える",
        body: "料金・仕様・納期といった定型質問の一次対応を自動化します。担当者は、判断が必要な相談だけに時間を使えるようになります。",
      },
      {
        title: "「何を聞かれているか」が資産になる",
        body: "会話ログは、そのまま顧客の不安リストです。よく聞かれる質問はサイトの改善点であり、商品説明・営業トークの改善材料にもなります。",
      },
    ],
    buildTime: "約15分",
    bullets: [
      "自社ドキュメントを知識源にした根拠つき回答",
      "答えられない質問は問い合わせフォームへ自動誘導",
      "会話ログの分析で「よく聞かれること」を可視化",
      "有人チャット・メール・チャットツールへのエスカレーション",
      "多言語対応（インバウンド・海外取引向け）",
    ],
    tech: [
      "Claude API / OpenAI API",
      "BM25（語彙検索）＋ベクトル検索のハイブリッド",
      "RAG（検索拡張生成）・再ランキング",
      "ストリーミング応答（Server-Sent Events）",
    ],
    useCases: [
      "問い合わせ電話・メールが多く工数を圧迫している企業",
      "料金や仕様の質問が購入前に多発するEC・SaaS",
      "社内規程・マニュアルの問い合わせ対応を減らしたい総務・情シス",
    ],
    demoNote:
      "このデモはブラウザの中だけで完結する検索型のボットです（本サイトは静的配信のため、外部AIへの通信は行いません）。約15分という実装時間には、この検索エンジン部分の実装も含まれています。当サイトのFAQ・サービス情報を知識源に、日本語の文字N-gramをBM25でスコアリングし、最も近い情報を根拠つきで返しています。単純なキーワード一致（grep）ではなく、語の希少性と文書長を加味して順位づけするため、「いくら？」のような自然文でも料金の項目に当てられます。実案件では、この検索の後段に Claude などの大規模言語モデルを接続して自然文を生成し、必要に応じてベクトル検索を併用したハイブリッド構成にします。「根拠を示す」「知らないことは答えない」という設計思想はデモと同じです。",
    howToUse: [
      "質問を入力するか、サジェストされた質問をクリック",
      "回答の下に、根拠として使った情報源が表示されます",
      "「料金は？」「京都以外も対応できる？」などを試してみてください",
    ],
  },
  {
    slug: "sns",
    title: "SNS連携",
    tagline: "更新の手間なく、動いているサイトを保つ。",
    impact: "SNSを更新すればサイトも更新され、放置感による信頼低下を防げる。",
    description:
      "Instagram・X・YouTube の投稿をサイトへ自動掲載し、あわせてシェア時に表示されるOGPカードを設計します。発信からサイト、問い合わせまでを一本につなぎます。",
    icon: "share",
    gradient: "from-rose-500 via-orange-400 to-amber-400",
    businessValue: [
      {
        title: "「止まっているサイト」に見られない",
        body: "最終更新が数年前のサイトは、それだけで発注をためらわせます。SNSの投稿が自動で流れ込めば、手間をかけずに動いている状態を保てます。",
      },
      {
        title: "シェア1回あたりのクリック率が変わる",
        body: "OGPカードは無料の広告枠です。サムネイル・タイトル・説明を設計するだけで、同じ拡散数から得られる流入が変わります。",
      },
      {
        title: "流れて消える投稿を、資産に変える",
        body: "SNSの投稿はタイムラインを流れて消えます。サイトに蓄積すれば検索から見つかり続け、実績集・ギャラリーとして働き続けます。",
      },
    ],
    buildTime: "約10分",
    bullets: [
      "Instagram / X / YouTube の投稿をサイトへ自動掲載",
      "OGP・Twitter Card の設計と動的画像生成",
      "シェアボタン・ハッシュタグ導線の設置",
      "投稿からLP・商品ページへの計測付きリンク",
      "APIのレート制限・障害時のフォールバック設計",
    ],
    tech: [
      "Instagram Graph API",
      "X API v2 / YouTube Data API",
      "OGP・Twitter Card",
      "Next.js OG Image（動的画像生成）",
      "ISR（定期再生成キャッシュ）",
    ],
    useCases: [
      "Instagramの発信を実績・ギャラリー代わりにしたい店舗・D2C",
      "シェアされる前提のキャンペーンLP",
      "社内の日常を継続的に見せたい採用サイト",
    ],
    demoNote:
      "このデモのフィードは、SNS APIの応答を模したサンプルデータです（静的サイトのため実APIには接続していません）。一方、右側の「OGPカードプレビュー」は入力内容からその場でカードを組み立てる実装で、X・Facebook・LINE それぞれの見え方の違いを実際に確認できます。実案件では、フィード部分を各SNSの公式APIに接続し、サーバー側で定期取得・キャッシュします。",
    howToUse: [
      "タブでSNSを切り替えると、フィードの絞り込みが動きます",
      "OGPカードのタイトル・説明・テーマを編集すると、プレビューが即時に反映されます",
      "プレビューの表示先（X / Facebook / LINE）も切り替えられます",
    ],
  },
  {
    slug: "integration",
    title: "他システムとの連携",
    tagline: "二重入力と転記ミスを、まとめて消す。",
    impact: "在庫・予約・顧客データが自動で同期し、人を増やさず処理量を増やせる。",
    description:
      "基幹システム・在庫管理・予約・CRM・決済など、すでに社内で動いているシステムとWebサイトをAPIで接続します。認証・リトライ・エラー通知まで含めた、止まらない連携設計が本領です。",
    icon: "plug",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    businessValue: [
      {
        title: "手作業の更新と転記が不要になる",
        body: "在庫や価格をサイトに書き写す作業、問い合わせをCRMに入力し直す作業が消えます。作業時間だけでなく、転記ミスによる信用の損失もなくなります。",
      },
      {
        title: "在庫切れの注文・ダブルブッキングを防ぐ",
        body: "サイトの表示と実在庫・実空き枠がリアルタイムで一致します。「注文後のお詫び連絡」という、最も損な仕事が発生しなくなります。",
      },
      {
        title: "営業の初動が速くなる",
        body: "問い合わせが自動でCRMに登録され、Slack等へ即時通知されます。反応の速さがそのまま受注率に効く商材ほど差が出ます。",
      },
    ],
    buildTime: "約10分",
    bullets: [
      "在庫・価格・予約枠のリアルタイム同期",
      "問い合わせ・申込のCRM（Salesforce・HubSpot等）自動登録",
      "kintone・Notion・Googleスプレッドシートとの双方向連携",
      "Webhookによるイベント通知（Slack・チャットワーク等）",
      "リトライ・冪等性・エラー通知を備えた堅牢な連携設計",
    ],
    tech: [
      "REST / GraphQL API",
      "Webhook・イベント駆動",
      "OAuth 2.0・APIキー管理",
      "ジョブキュー・リトライ制御",
      "kintone / Salesforce / Shopify / Stripe",
    ],
    useCases: [
      "在庫や空き状況をサイトに即時反映したい小売・宿泊",
      "問い合わせを手作業でCRMに転記している営業組織",
      "複数SaaSにデータが散らばり集計に時間がかかっている企業",
    ],
    demoNote:
      "このデモは、社内システムを模した「モックAPI」をブラウザ内で動かしています。検索・予約の操作に対して、実際に非同期の応答・遅延・失敗（一定確率）が起き、リトライやWebhook通知がイベントログにリアルタイムで流れます。実案件では、このモックの部分をお客様の実システムのAPIに差し替えるだけで、同じ仕組みが動きます。",
    howToUse: [
      "在庫を検索し、任意の商品で「予約を実行」を押してください",
      "右側のイベントログに、API呼び出し・Webhook通知が時系列で流れます",
      "「障害シミュレーション」をONにすると、失敗時のリトライ挙動を確認できます",
    ],
  },
];

export function getCapability(slug: string): Capability | undefined {
  return capabilities.find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------
 * サービス
 * ---------------------------------------------------------------- */

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: IconKey;
  features: string[];
};

export const services: Service[] = [
  {
    slug: "ai-web-production",
    title: "AI活用型Web制作",
    description:
      "各工程に生成AIを組み込み、従来の数分の一の期間で構築。空いた時間は、AIには決められない戦略と品質の作り込みに充てます。",
    icon: "sparkles",
    features: ["AIによる高速プロトタイピング", "最短5日で公開", "人の監修による品質担保"],
  },
  {
    slug: "corporate",
    title: "コーポレートサイト制作",
    description:
      "信頼性を高め、採用・取引・問い合わせにつなげる企業サイト。CMSで自社更新もできます。",
    icon: "layout",
    features: ["情報設計・ワイヤーフレーム", "CMS（記事・実績更新）", "問い合わせ最適化"],
  },
  {
    slug: "landing-page",
    title: "ランディングページ（LP）制作",
    description:
      "コンバージョン特化のLPを制作。AIで複数の訴求案を高速に検証し、勝ちパターンを見つけます。",
    icon: "target",
    features: ["訴求設計・コピー", "高速表示・計測タグ", "A/Bテスト対応"],
  },
  {
    slug: "ai-development",
    title: "AIチャットボット・AI機能開発",
    description:
      "自社データを知識源にしたチャットボット、文書要約、問い合わせの自動分類など、事業に効くAI機能を組み込みます。",
    icon: "chat",
    features: ["RAG構成（根拠つき回答）", "Claude / OpenAI API連携", "運用・チューニング支援"],
  },
  {
    slug: "system-integration",
    title: "システム連携・Webアプリ開発",
    description:
      "在庫・予約・CRMなど既存システムとWebをAPIで接続。予約・会員・管理画面のWebアプリ開発にも対応します。",
    icon: "plug",
    features: ["API・Webhook連携", "認証・管理画面", "業務フローの自動化"],
  },
  {
    slug: "3dcg-webgl",
    title: "3DCG・WebGL・アニメーション",
    description:
      "Three.js / WebGL による3D表現と、サイト内アニメーションの設計・実装。世界観を動きと立体で伝えます。",
    icon: "cube",
    features: ["Three.js / WebGL実装", "3DCGモデリング・レンダリング", "軽量化と表示速度の両立"],
  },
  {
    slug: "renewal",
    title: "サイトリニューアル",
    description:
      "表示速度・スマホ対応・SEO・AI検索対応の観点で刷新。検索評価を引き継ぎながら成果を底上げします。",
    icon: "refresh",
    features: ["現状分析・課題抽出", "リダイレクト設計", "評価を落とさない移行"],
  },
  {
    slug: "seo-aeo-llmo",
    title: "SEO・AEO・LLMO対策",
    description:
      "検索エンジンに加え、生成AI（AI Overviews・ChatGPT等）から引用・推薦されるための最適化まで実装します。",
    icon: "search",
    features: ["キーワード・エンティティ設計", "構造化データ・llms.txt整備", "結論ファーストのAI最適化"],
  },
];

/* ------------------------------------------------------------------
 * AIをどう使っているか（一次情報＝E-E-A-Tの Expertise）
 * ---------------------------------------------------------------- */

export type AiStep = {
  phase: string;
  title: string;
  description: string;
  /** AIが担当する部分 */
  ai: string;
  /** 人間が担当する部分（AI任せにしない領域の明示＝信頼性） */
  human: string;
  icon: IconKey;
};

export const aiWorkflow: AiStep[] = [
  {
    phase: "01",
    title: "要件整理・構成設計",
    description:
      "ヒアリング内容をその場で構造化し、構成案とキーワード設計を複数パターン生成。比較して方針を決めます。",
    ai: "議事録の構造化、競合調査の要約、構成案の複数生成",
    human: "事業理解にもとづく方針の決定、優先順位づけ",
    icon: "target",
  },
  {
    phase: "02",
    title: "デザイン・コピー",
    description:
      "訴求軸ごとにコピーとデザイン方向性を高速生成。人が選び、磨いて仕上げます。",
    ai: "コピー案の量産、トーン調整、代替案の提示",
    human: "ブランドらしさの判断、最終的な表現の決定",
    icon: "palette",
  },
  {
    phase: "03",
    title: "実装",
    description:
      "AIコーディングエージェントで実装を並列化。人が設計方針を定め、コードをレビューします。",
    ai: "コンポーネント実装、リファクタリング、テスト生成",
    human: "設計方針、コードレビュー、パフォーマンス調整",
    icon: "code",
  },
  {
    phase: "04",
    title: "SEO / AEO / LLMO",
    description:
      "構造化データ・llms.txt・結論ファーストの文章設計で、生成AIが引用しやすい形に整えます。",
    ai: "構造化データ生成、AIからの見え方の検証",
    human: "戦略キーワードの選定、情報の正確性の担保",
    icon: "sparkles",
  },
  {
    phase: "05",
    title: "テスト・公開",
    description:
      "表示崩れ・リンク・Core Web Vitals を自動チェックし、安全に公開します。",
    ai: "自動テスト、パフォーマンス計測、崩れ検出",
    human: "公開判断、実機での最終確認",
    icon: "check",
  },
  {
    phase: "06",
    title: "運用・改善",
    description:
      "アクセスデータをAIで分析し、改善案を継続的に提示します。",
    ai: "アクセス解析の要約、改善案の提示",
    human: "施策の意思決定、事業への接続",
    icon: "chart",
  },
];

/** AI活用によって何が変わるか（Before / After） */
export const aiImpacts: { label: string; before: string; after: string }[] = [
  { label: "初回提案までの期間", before: "1〜2週間", after: "最短2営業日" },
  { label: "コーポレートサイトの制作期間", before: "2〜3か月", after: "3〜4週間" },
  { label: "小規模サイトの公開まで", before: "3〜4週間", after: "最短5日" },
  { label: "改善提案のサイクル", before: "月1回", after: "週1回以上" },
];

/* ------------------------------------------------------------------
 * 強み
 * ---------------------------------------------------------------- */

export type Strength = { title: string; description: string; icon: IconKey };
export const strengths: Strength[] = [
  {
    title: "AIを駆使して、圧倒的に速く",
    description:
      "設計・コピー・実装・テストの全工程にAIエージェントを組み込み、制作期間は従来の約1/3。小規模サイトなら最短5日で公開できます。",
    icon: "rocket",
  },
  {
    title: "速いだけでなく、高性能",
    description:
      "浮いた時間は、すべて品質に再投資します。その結果がこのサイト自身で、Lighthouse 性能スコア100点で動いています。",
    icon: "gauge",
  },
  {
    title: "AIに強い会社が作る、AI時代のサイト",
    description:
      "AIチャットボットを作る側だからこそ、生成AIに引用・推薦される設計（AEO / LLMO）も内側から分かります。",
    icon: "sparkles",
  },
  {
    title: "できることを、実物で見せる",
    description:
      "3DCG・アニメーション・AIチャットボット・SNS連携・システム連携。5領域すべてを、触れるデモとして公開しています。",
    icon: "cube",
  },
];

/* ------------------------------------------------------------------
 * 料金・流れ
 * ---------------------------------------------------------------- */

export type Plan = {
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: "ライト",
    price: "¥298,000〜",
    priceNote: "最短5日で公開",
    description: "まず名刺代わりのサイトを、速く・きれいに立ち上げたい方へ。",
    features: [
      "5ページ程度",
      "スマホ最適化",
      "基本SEO設定",
      "お問い合わせフォーム",
      "最短5日で公開",
    ],
  },
  {
    name: "スタンダード",
    price: "¥680,000〜",
    priceNote: "もっとも選ばれるプラン",
    description: "集客・採用まで成果を出したい企業に最適な標準プラン。",
    features: [
      "10〜20ページ",
      "CMS（自社更新）",
      "戦略設計・ライティング",
      "SEO / AEO / LLMO実装",
      "Core Web Vitals最適化",
      "公開後1か月サポート",
    ],
    featured: true,
  },
  {
    name: "プレミアム",
    price: "¥1,500,000〜",
    priceNote: "AI機能・3D・システム連携まで",
    description: "AIチャットボット、3DCG演出、基幹システム連携まで一気通貫で構築。",
    features: [
      "オリジナルデザイン・3DCG演出",
      "AIチャットボット構築（RAG）",
      "既存システムとのAPI連携",
      "Webアプリ・管理画面開発",
      "月次の運用・改善",
    ],
  },
];

export type Step = { title: string; description: string };
export const steps: Step[] = [
  { title: "ヒアリング・無料相談", description: "事業の目標と課題を伺い、サイトに求める成果を明確にします。" },
  { title: "企画・設計", description: "AIで構成案を複数生成し、比較しながら方針とお見積もりを決定します。" },
  { title: "デザイン", description: "ブランドに合わせたUIデザインを作成。スマホ表示まで確認いただきます。" },
  { title: "開発・実装", description: "AIエージェントで実装を並列化し、人がレビュー。速度と品質を作り込みます。" },
  { title: "テスト・公開", description: "表示・計測・SEO設定を自動チェックのうえ、安全に本番公開します。" },
  { title: "運用・改善", description: "公開後はアクセス解析をもとに、継続的に改善・成長させます。" },
];

/* ------------------------------------------------------------------
 * FAQ（AEO / LLMO：質問→簡潔な答え）
 * ---------------------------------------------------------------- */

export type Faq = { question: string; answer: string };
export const faqs: Faq[] = [
  {
    question: "AIを使うと、制作はどれくらい速くなりますか？",
    answer:
      "制作期間は従来の約1/3が目安です。小規模サイトなら最短5日、標準的なコーポレートサイトで3〜4週間で公開できます。要件整理・コピー・実装・テストの各工程にAIエージェントを組み込み、人は設計判断と品質のレビューに集中するためです。",
  },
  {
    question: "AIで作ると品質は落ちませんか？",
    answer:
      "落ちません。AIは「量産できる工程」を担当し、設計方針・ブランド表現の判断・コードレビュー・公開判断は必ず人が行います。AIで浮いた時間を品質に再投資できるため、むしろ作り込みは深くなります。実際に当サイトはAIを駆使して制作し、Lighthouse 性能スコア100点で動いています。",
  },
  {
    question: "EbisuSoftはどこにありますか？",
    answer:
      "京都府京都市伏見区に拠点を置くWeb制作会社です。京都・滋賀・大阪を中心に、オンラインで日本全国のご依頼に対応しています。",
  },
  {
    question: "3DCGやWebアニメーションはどんなことができますか？",
    answer:
      "Three.js / WebGLによる製品の360度ビューア、ブランドの3D演出、空間ビジュアライズのほか、スクロール連動演出やSVGアニメーションまで対応します。実際に動くデモをサイト内（できること）で公開しているので、発注前にご確認いただけます。",
  },
  {
    question: "AIチャットボットは自社の情報に答えられますか？",
    answer:
      "はい。自社のサービス情報・FAQ・社内マニュアルなどを知識源にしたRAG（検索拡張生成）構成で構築します。回答の根拠となった文書を提示でき、知識源にない質問には答えず問い合わせへ誘導するため、誤った回答のリスクを抑えられます。",
  },
  {
    question: "既存の基幹システムや予約システムと連携できますか？",
    answer:
      "できます。REST / GraphQL API や Webhook を用いて、在庫・予約枠・顧客データをリアルタイムに同期します。kintone・Salesforce・Shopify・Stripe などの連携実装に対応し、リトライやエラー通知まで含めた止まらない設計を行います。",
  },
  {
    question: "SNSの投稿をサイトに表示できますか？",
    answer:
      "はい。Instagram Graph API・X API・YouTube Data API などから投稿を定期取得し、サイトに自動掲載します。あわせて、シェア時に表示されるOGPカードの設計・動的生成も行い、拡散時のクリック率を高めます。",
  },
  {
    question: "AEO・LLMOとは何ですか？",
    answer:
      "AEOは検索やAIが返す「答え」に選ばれるための最適化（Answer Engine Optimization）、LLMOはChatGPTなどの生成AIに情報源として引用・推薦されるための最適化（LLM Optimization）です。EbisuSoftはAI開発を手がける立場から、この両方を制作段階で実装します。",
  },
  {
    question: "ChatGPTやAI Overviewsからの集客にも対応できますか？",
    answer:
      "はい。構造化データの整備、結論ファーストの文章設計、llms.txtの設置、AIクローラーの許可設定などを行い、生成AIに引用・推薦されやすいサイトに仕上げます。",
  },
  {
    question: "料金の目安を教えてください。",
    answer:
      "ライトプランは298,000円〜、スタンダードは680,000円〜、AI機能や3D・システム連携を含むプレミアムは1,500,000円〜です。ページ数や機能により変動するため、ご要望を伺ったうえでお見積もりします。初回のご相談・お見積もりは無料です。",
  },
  {
    question: "京都以外の企業でも依頼できますか？",
    answer:
      "できます。打ち合わせはオンライン会議で完結できるため、全国からご依頼いただけます。京都・滋賀・大阪など近隣であれば対面での打ち合わせにも伺います。",
  },
  {
    question: "公開後の更新や運用もお願いできますか？",
    answer:
      "CMS導入による自社更新のほか、月次の運用・保守・改善提案にも対応しています。AIでアクセスデータを分析し、週次で改善案をご提示することも可能です。",
  },
];

/**
 * 要点（TL;DR）。結論ファーストで端的に記述し、AI・検索エンジンが
 * そのまま引用しやすい形（AEO / LLMO）にしています。llms.txt とも共有。
 */
export const keyFacts: { q: string; a: string }[] = [
  {
    q: "EbisuSoftとは？",
    a: "京都市伏見区を拠点に、AIを駆使して最速・高性能なWebサイトを制作するAI活用型のWeb制作会社です。",
  },
  {
    q: "何が得意？",
    a: "生成AIを制作フロー全体に組み込んだ高速開発と、3DCG・Webアニメーション・AIチャットボット・SNS連携・業務システム連携の実装です。すべて実際に動くデモをサイト内で公開しています。",
  },
  {
    q: "どれくらい速い？",
    a: "制作期間は従来の約1/3。小規模サイトは最短5日、コーポレートサイトは3〜4週間で公開できます。",
  },
  { q: "対応エリアは？", a: "京都・滋賀・大阪を中心に、オンラインで日本全国に対応しています。" },
  {
    q: "費用の目安は？",
    a: "298,000円〜（小規模）／680,000円〜（標準）／1,500,000円〜（AI機能・3D・システム連携）。初回のご相談・お見積もりは無料です。",
  },
];

/** テックマーキー（技術スタック・専門領域のスクロール表示） */
export const techStack = [
  "AI Agents",
  "Claude API",
  "RAG",
  "Next.js",
  "React",
  "TypeScript",
  "Three.js",
  "WebGL",
  "3DCG",
  "Web Animations",
  "API Integration",
  "Webhook",
  "SEO",
  "AEO",
  "LLMO",
  "Core Web Vitals",
  "Schema.org",
] as const;

export type AeoTactic = { title: string; description: string; icon: IconKey };

/** AEO / LLMO（AI検索最適化）セクションのコンテンツ。 */
export const aeo = {
  definitions: [
    {
      term: "AEO",
      full: "Answer Engine Optimization",
      description: "検索結果やAIが提示する「答え」に、自社の情報が選ばれるための最適化。",
    },
    {
      term: "LLMO",
      full: "LLM Optimization",
      description:
        "ChatGPTなどの生成AIが回答を作る際に、自社を情報源として引用・推薦してもらうための最適化。",
    },
  ],
  tactics: [
    {
      title: "構造化データの作り込み",
      description: "事業者・サービス・FAQ・手順をschema.orgで明示し、AIが意味を正確に理解できる状態にします。",
      icon: "code",
    },
    {
      title: "結論ファーストの文章設計",
      description: "問いへの答えを先頭に簡潔に置き、AIがそのまま引用しやすい形に整えます。",
      icon: "target",
    },
    {
      title: "llms.txt の設置",
      description: "AI向けにサイトの要点を案内する llms.txt を用意し、参照されやすくします。",
      icon: "layout",
    },
    {
      title: "AIクローラーの歓迎",
      description: "GPTBot・ClaudeBot・PerplexityBot等のアクセスを許可し、学習・引用の対象にします。",
      icon: "shield",
    },
    {
      title: "エンティティ最適化",
      description: "社名・所在地・専門領域を一貫した情報として記述し、AIに“何の専門家か”を認識させます。",
      icon: "search",
    },
    {
      title: "一次情報・実物の提示",
      description: "実際に動くデモや具体的な数値など、引用価値の高い一次情報を用意し、AIに選ばれる根拠を増やします。",
      icon: "chart",
    },
  ] as AeoTactic[],
};
