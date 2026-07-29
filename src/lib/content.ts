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
  { value: "5種類", label: "サイト内で試せる実動デモ" },
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
  /** 一覧カード用の短い説明 */
  tagline: string;
  /** 詳細ページ・構造化データ用の説明 */
  description: string;
  icon: IconKey;
  /** カードのビジュアル用グラデーション（Tailwind クラス） */
  gradient: string;
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
    tagline: "ブラウザ上でぬるぬる動く3D。製品もブランドも立体で見せる。",
    description:
      "Three.js / WebGL を使い、ブラウザ上で動く3DCGを実装します。製品の360度ビューア、ブランドのシンボル演出、空間ビジュアライズなど、平面のサイトでは伝わらない情報量と没入感を届けます。ポリゴン数とテクスチャを最適化し、スマートフォンでも滑らかに動く軽さと両立させます。",
    icon: "cube",
    gradient: "from-cyan-500 via-sky-500 to-violet-500",
    bullets: [
      "製品の360度ビューア（回転・ズーム・カラー変更）",
      "ブランドシンボルやヒーローの3D演出",
      "建築・空間のウォークスルー、地図・データの3D可視化",
      "スマホでも滑らかに動く軽量化（LOD・圧縮テクスチャ）",
    ],
    tech: ["Three.js", "WebGL", "GLSL", "glTF / Draco圧縮", "React Three Fiber"],
    useCases: [
      "製品をあらゆる角度から見せたいメーカー・BtoB",
      "世界観で差をつけたいブランドサイト",
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
    tagline: "スクロールに反応し、触れると返事をする。“動き”で伝える設計。",
    description:
      "スクロール連動の演出、SVGの描画アニメーション、テキストエフェクト、マイクロインタラクションなど、Webサイト内の「動き」を設計・実装します。装飾のためではなく、視線を誘導し、理解を助け、操作の手応えを返すための動きです。すべてGPUに優しい実装で、表示速度を落としません。",
    icon: "sparkles",
    gradient: "from-violet-500 via-fuchsia-500 to-amber-400",
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
      "スクロールで物語を伝えるブランドサイト・LP",
      "説明が難しいサービスをアニメーションで図解したいBtoB",
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
    tagline: "24時間、サイトの中で質問に答える。問い合わせの前の一次対応を自動化。",
    description:
      "自社の情報（サービス内容・料金・FAQ・社内マニュアル等）を知識源として、訪問者の質問に自動で答えるAIチャットボットを構築します。RAG（検索拡張生成）構成にすることで「知らないことは答えない」精度を確保し、根拠となった情報の出典も提示できます。問い合わせ対応の工数を削減しつつ、離脱していた見込み客を拾い上げます。",
    icon: "chat",
    gradient: "from-emerald-500 via-teal-400 to-cyan-400",
    bullets: [
      "自社ドキュメントを知識源にしたRAG構成（根拠つき回答）",
      "回答できない質問は問い合わせフォームへ自動誘導",
      "会話ログの分析で「よく聞かれること」を可視化",
      "有人チャット・メール・チャットツールへのエスカレーション",
      "多言語対応（インバウンド・海外取引向け）",
    ],
    tech: [
      "Claude API / OpenAI API",
      "RAG（ベクトル検索 + 再ランキング）",
      "埋め込みモデル・ベクトルDB",
      "ストリーミング応答（Server-Sent Events）",
    ],
    useCases: [
      "問い合わせ電話・メールが多く工数を圧迫している企業",
      "料金や仕様の質問が購入前に多発するEC・SaaS",
      "社内規程・マニュアルの問い合わせ対応を減らしたい総務・情シス",
    ],
    demoNote:
      "重要：このデモはブラウザの中だけで完結する「検索型」のボットです（本サイトは静的配信のため、外部AIへの通信は行いません）。当サイトのFAQ・サービス情報を知識源に、日本語の文字N-gramで類似度を計算し、最も近い情報を根拠つきで返しています。実案件では、この検索部分の後段に Claude などの大規模言語モデルを接続し、自然な文章での生成回答に置き換えます。回答の「根拠を示す」「知らないことは答えない」という設計思想はデモと同じです。",
    howToUse: [
      "質問を入力するか、サジェストされた質問をクリック",
      "回答の下に、根拠として使った情報源が表示されます",
      "「料金は？」「京都以外も対応できる？」などを試してみてください",
    ],
  },
  {
    slug: "sns",
    title: "SNS連携",
    tagline: "投稿をサイトに流し込み、シェアされたときの見え方まで設計する。",
    description:
      "Instagram・X（旧Twitter）・YouTube などの投稿をWebサイトに自動で取り込み、更新の手間なく「動いているサイト」を保ちます。あわせて、SNSでシェアされたときに表示されるOGPカード（サムネイル・タイトル・説明）を設計・実装し、拡散時のクリック率を高めます。投稿からサイト、サイトから問い合わせまでの導線を一本につなぎます。",
    icon: "share",
    gradient: "from-rose-500 via-orange-400 to-amber-400",
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
      "Instagramの発信をサイトの実績・ギャラリー代わりにしたい店舗・D2C",
      "シェアされる前提のキャンペーンLP",
      "採用サイトで社内の日常を継続的に見せたい企業",
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
    tagline: "在庫・予約・顧客データ。既存システムとサイトをAPIでつなぐ。",
    description:
      "基幹システム・在庫管理・予約システム・CRM／SFA・会計ソフト・決済など、すでに社内で動いているシステムとWebサイトをAPIで接続します。「サイトの情報を手作業で更新する」「問い合わせを転記する」といった二重管理をなくし、Webサイトを事業システムの一部として動かします。認証・リトライ・エラー通知まで含めた、止まらない連携設計が本領です。",
    icon: "plug",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
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
      "在庫や空き状況をサイトにリアルタイム表示したい小売・宿泊",
      "問い合わせを手作業でCRMに転記している営業組織",
      "複数SaaSにデータが散らばり、集計に時間がかかっている企業",
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
      "要件整理・構成設計・コピー・実装・テストの各工程に生成AIを組み込み、従来の数分の一の期間でサイトを構築します。空いた時間は、AIには決められない戦略と品質の作り込みに充てます。",
    icon: "sparkles",
    features: ["AIによる高速プロトタイピング", "最短5日で公開", "人の監修による品質担保"],
  },
  {
    slug: "corporate",
    title: "コーポレートサイト制作",
    description:
      "ブランドの信頼性を高め、採用・取引・問い合わせにつなげる企業サイトを設計から構築します。CMSで自社更新も可能です。",
    icon: "layout",
    features: ["情報設計・ワイヤーフレーム", "CMS（記事・実績更新）", "問い合わせ最適化"],
  },
  {
    slug: "landing-page",
    title: "ランディングページ（LP）制作",
    description:
      "広告やキャンペーンの成果を最大化する、コンバージョン特化のLPを制作。AIで複数の訴求案を高速に生成・検証し、勝ちパターンを見つけます。",
    icon: "target",
    features: ["訴求設計・コピー", "高速表示・計測タグ", "A/Bテスト対応"],
  },
  {
    slug: "ai-development",
    title: "AIチャットボット・AI機能開発",
    description:
      "自社データを知識源にしたRAG型チャットボット、文書要約、問い合わせ自動分類など、事業に効くAI機能をWebに組み込みます。",
    icon: "chat",
    features: ["RAG構成（根拠つき回答）", "Claude / OpenAI API連携", "運用・チューニング支援"],
  },
  {
    slug: "system-integration",
    title: "システム連携・Webアプリ開発",
    description:
      "在庫・予約・CRMなど既存システムとWebをAPIで接続。予約・会員・管理画面といったWebアプリ開発もNext.jsで対応します。",
    icon: "plug",
    features: ["API・Webhook連携", "認証・管理画面", "業務フローの自動化"],
  },
  {
    slug: "3dcg-webgl",
    title: "3DCG・WebGL・アニメーション",
    description:
      "Three.js / WebGL によるインタラクティブな3D表現と、サイト内アニメーションの設計・実装。ブランドの世界観を、動きと立体で伝えます。",
    icon: "cube",
    features: ["Three.js / WebGL実装", "3DCGモデリング・レンダリング", "軽量化と表示速度の両立"],
  },
  {
    slug: "renewal",
    title: "サイトリニューアル",
    description:
      "古くなったサイトを、表示速度・スマホ最適化・SEO・AI検索対応の観点から刷新。検索評価を引き継ぎながら成果を底上げします。",
    icon: "refresh",
    features: ["現状分析・課題抽出", "リダイレクト設計", "評価を落とさない移行"],
  },
  {
    slug: "seo-aeo-llmo",
    title: "SEO・AEO・LLMO対策",
    description:
      "検索エンジンに加え、生成AI（AI Overviews・ChatGPT・Perplexity等）から引用・推薦されるためのAEO / LLMO最適化までワンストップで実装します。",
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
      "ヒアリング内容をその場で構造化し、サイト構成案とキーワード設計を複数パターン生成。比較しながら方針を決めます。",
    ai: "議事録の構造化、競合調査の要約、構成案の複数生成",
    human: "事業理解にもとづく方針の決定、優先順位づけ",
    icon: "target",
  },
  {
    phase: "02",
    title: "デザイン・コピー",
    description:
      "訴求軸ごとにコピー案とデザイン方向性を高速に生成。人が選び、磨き、ブランドのトーンに合わせて仕上げます。",
    ai: "コピー案の量産、トーン調整、代替案の提示",
    human: "ブランドらしさの判断、最終的な表現の決定",
    icon: "palette",
  },
  {
    phase: "03",
    title: "実装",
    description:
      "AIコーディングエージェントで実装を並列化。人はアーキテクチャと品質基準を定め、生成されたコードをレビューします。",
    ai: "コンポーネント実装、リファクタリング、テスト生成",
    human: "設計方針、コードレビュー、パフォーマンス調整",
    icon: "code",
  },
  {
    phase: "04",
    title: "SEO / AEO / LLMO",
    description:
      "構造化データ・llms.txt・結論ファーストの文章設計を実装。生成AIが引用しやすい形にサイト全体を整えます。",
    ai: "構造化データ生成、AIからの見え方の検証",
    human: "戦略キーワードの選定、情報の正確性の担保",
    icon: "sparkles",
  },
  {
    phase: "05",
    title: "テスト・公開",
    description:
      "表示崩れ・リンク・Core Web Vitals を自動チェック。最終確認を経て安全に公開します。",
    ai: "自動テスト、パフォーマンス計測、崩れ検出",
    human: "公開判断、実機での最終確認",
    icon: "check",
  },
  {
    phase: "06",
    title: "運用・改善",
    description:
      "アクセスデータをAIで分析し、改善案を継続的に提示。仮説検証のサイクルを速く回します。",
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
      "設計・コピー・実装・テストの全工程にAIエージェントを組み込み、制作期間を従来の約1/3に短縮。小規模サイトなら最短5日で公開できます。速さは、そのまま事業のスピードになります。",
    icon: "rocket",
  },
  {
    title: "速いだけでなく、高性能",
    description:
      "AIで浮いた時間を品質に投資します。最新のNext.jsで構築し、Core Web Vitals（LCP / CLS / INP）を作り込み。当サイト自身が Lighthouse 性能スコア100点で動いている実物です。",
    icon: "gauge",
  },
  {
    title: "AIに強い会社が作る、AI時代のサイト",
    description:
      "AIチャットボット開発やRAG構成の実装を手がけるからこそ、生成AIに「引用・推薦される」サイト設計（AEO / LLMO）も内側から理解しています。作る手段も、対策する相手も、AIです。",
    icon: "sparkles",
  },
  {
    title: "できることを、実物で見せる",
    description:
      "3DCG・アニメーション・AIチャットボット・SNS連携・システム連携。すべて口頭の説明ではなく、このサイト内で実際に触れるデモとして公開しています。発注前に、実力を確かめてください。",
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
