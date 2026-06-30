/**
 * トップページの掲載コンテンツの単一情報源。
 * FAQ・サービス・お客様の声などは UI と JSON-LD（構造化データ）の双方から
 * 参照するため、ここに集約して内容の食い違いを防ぎます。
 * テキストはすべて差し替え前提のサンプルです。
 */

import type { IconKey } from "@/components/ui/icons";

export type NavItem = { label: string; href: string };
export const nav: NavItem[] = [
  { label: "選ばれる理由", href: "#strengths" },
  { label: "サービス", href: "#services" },
  { label: "AI検索対策", href: "#ai-search" },
  { label: "制作実績", href: "#works" },
  { label: "料金", href: "#pricing" },
  { label: "よくある質問", href: "#faq" },
];

export type Stat = { value: string; label: string };
export const stats: Stat[] = [
  { value: "120+", label: "Web制作の累計実績" },
  { value: "98%", label: "公開後の運用継続率" },
  { value: "1.8倍", label: "問い合わせ数の平均改善" },
  { value: "最短2週間", label: "公開までのスピード" },
];

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: IconKey;
  features: string[];
};

export const services: Service[] = [
  {
    slug: "corporate",
    title: "コーポレートサイト制作",
    description:
      "ブランドの信頼性を高め、採用・取引・問い合わせにつなげる企業サイトを設計から構築します。CMSで自社更新も可能。",
    icon: "layout",
    features: ["情報設計・ワイヤーフレーム", "CMS（記事・実績更新）", "問い合わせ最適化"],
  },
  {
    slug: "landing-page",
    title: "ランディングページ（LP）制作",
    description:
      "広告やキャンペーンの成果を最大化する、コンバージョン特化のLPを制作。検証しやすい構成でCVR改善まで伴走します。",
    icon: "target",
    features: ["訴求設計・コピー", "高速表示・計測タグ", "A/Bテスト対応"],
  },
  {
    slug: "ec",
    title: "ECサイト構築",
    description:
      "Shopify・headless構成など、運用しやすく伸ばせるECを構築。購入導線とリピート設計で売上に貢献します。",
    icon: "cart",
    features: ["カート・決済連携", "在庫・受注運用", "回遊・リピート設計"],
  },
  {
    slug: "web-app",
    title: "Webアプリ・予約システム",
    description:
      "予約・会員・問い合わせ管理など、業務に合わせたWebアプリをNext.jsで開発。拡張しやすい設計で内製化も支援します。",
    icon: "code",
    features: ["要件定義・設計", "API・データベース連携", "認証・管理画面"],
  },
  {
    slug: "renewal",
    title: "サイトリニューアル",
    description:
      "古くなったサイトを、表示速度・スマホ最適化・SEOの観点から刷新。評価を引き継ぎながら成果を底上げします。",
    icon: "refresh",
    features: ["現状分析・課題抽出", "リダイレクト設計", "評価を落とさない移行"],
  },
  {
    slug: "seo-aeo-llmo",
    title: "SEO・AEO・LLMO対策",
    description:
      "検索エンジンに加え、生成AI（AI Overviews・ChatGPT・Perplexity等）から引用・推薦されるためのAEO / LLMO最適化までワンストップで実装します。",
    icon: "sparkles",
    features: ["キーワード・エンティティ設計", "構造化データ・llms.txt整備", "結論ファーストのAI最適化"],
  },
];

export type Strength = { title: string; description: string; icon: IconKey };
export const strengths: Strength[] = [
  {
    title: "成果から逆算する設計",
    description:
      "「きれいなサイト」で終わらせません。問い合わせ・採用・売上といったゴールから逆算し、構成・導線・コピーを設計します。",
    icon: "chart",
  },
  {
    title: "SEO×AEO×LLMOに対応",
    description:
      "従来のSEOに加え、AI Overviews・ChatGPT・Perplexityなどに引用・推薦される“AI検索最適化（AEO / LLMO）”を制作段階から実装します。",
    icon: "sparkles",
  },
  {
    title: "圧倒的な表示速度",
    description:
      "最新のNext.jsで構築し、Core Web Vitals（LCP/CLS/INP）を重視。速いサイトは離脱を防ぎ、検索評価にも有利です。",
    icon: "gauge",
  },
  {
    title: "公開後も伴走",
    description:
      "作って納品して終わりではなく、アクセス解析・改善提案・運用までワンチームで伴走。事業成長に合わせて育てます。",
    icon: "headset",
  },
];

export type Work = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  /** カードのダミービジュアル用グラデーション（Tailwind クラス） */
  gradient: string;
};

export const works: Work[] = [
  {
    title: "製造業A社 コーポレートサイト",
    category: "コーポレート",
    description: "採用応募数が前年比2.4倍。技術力が伝わる情報設計で取引問い合わせも増加。",
    tags: ["コーポレート", "採用", "CMS"],
    gradient: "from-indigo-500 via-violet-500 to-sky-400",
  },
  {
    title: "D2Cブランド ECサイト",
    category: "EC",
    description: "Shopifyで構築。回遊設計とLP連携でCVRが1.7倍に改善。",
    tags: ["EC", "Shopify", "CVR改善"],
    gradient: "from-rose-500 via-orange-400 to-amber-400",
  },
  {
    title: "SaaS B社 サービスLP",
    category: "LP",
    description: "広告ランディングを刷新し、無料トライアル登録数が大幅増。",
    tags: ["LP", "BtoB", "広告連携"],
    gradient: "from-emerald-500 via-teal-400 to-cyan-400",
  },
  {
    title: "クリニックC 予約サイト",
    category: "Webアプリ",
    description: "オンライン予約システムを内製化し、電話対応の工数を削減。",
    tags: ["予約システム", "医療", "業務効率化"],
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
  },
  {
    title: "士業事務所 サイトリニューアル",
    category: "リニューアル",
    description: "表示速度とスマホ対応を刷新。指名検索からの相談予約が増加。",
    tags: ["リニューアル", "SEO", "高速化"],
    gradient: "from-fuchsia-500 via-purple-500 to-indigo-500",
  },
  {
    title: "地域メディア コンテンツSEO",
    category: "SEO",
    description: "構造化データと内部設計を最適化し、検索流入が半年で3倍に。",
    tags: ["SEO", "メディア", "構造化データ"],
    gradient: "from-amber-500 via-yellow-400 to-lime-400",
  },
];

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
    priceNote: "小規模・スピード公開",
    description: "まず名刺代わりのサイトを早く・きれいに立ち上げたい方へ。",
    features: ["5ページ程度", "スマホ最適化", "基本SEO設定", "お問い合わせフォーム", "最短2週間で公開"],
  },
  {
    name: "スタンダード",
    price: "¥680,000〜",
    priceNote: "もっとも選ばれるプラン",
    description: "集客・採用までしっかり成果を出したい企業に最適な標準プラン。",
    features: [
      "10〜20ページ",
      "CMS（自社更新）",
      "戦略設計・ライティング",
      "構造化データ・内部SEO",
      "Core Web Vitals最適化",
      "公開後1か月サポート",
    ],
    featured: true,
  },
  {
    name: "プレミアム",
    price: "¥1,500,000〜",
    priceNote: "戦略から運用まで伴走",
    description: "ブランディング・Webアプリ・継続運用まで一気通貫で支援。",
    features: [
      "オリジナルデザイン",
      "Webアプリ・システム開発",
      "撮影・コンテンツ制作",
      "アクセス解析・改善提案",
      "月次の運用・保守",
    ],
  },
];

export type Step = { title: string; description: string };
export const steps: Step[] = [
  { title: "ヒアリング・無料相談", description: "事業の目標と課題を伺い、サイトに求める成果を明確にします。" },
  { title: "企画・設計", description: "サイト構成・キーワード設計・導線を設計し、見積もりをご提示します。" },
  { title: "デザイン", description: "ブランドに合わせたUIデザインを作成。スマホ表示まで確認いただきます。" },
  { title: "開発・実装", description: "Next.jsで高速・高品質に実装。SEOと表示速度を作り込みます。" },
  { title: "テスト・公開", description: "表示・計測・SEO設定を確認し、安全に本番公開します。" },
  { title: "運用・改善", description: "公開後はアクセス解析をもとに、継続的に改善・成長させます。" },
];

export type Testimonial = { quote: string; author: string; role: string; rating: number };
export const testimonials: Testimonial[] = [
  {
    quote:
      "「作って終わり」ではなく成果まで一緒に考えてくれました。公開後3か月で問い合わせが2倍になり、社内でも驚いています。",
    author: "T.K 様",
    role: "製造業・経営企画",
    rating: 5,
  },
  {
    quote:
      "表示速度とSEOの説明がとにかく分かりやすい。専門用語を噛み砕いて伴走してくれるので、安心して任せられました。",
    author: "M.S 様",
    role: "D2Cブランド・代表",
    rating: 5,
  },
  {
    quote:
      "予約システムまで内製化していただき、電話対応の負担が激減。費用以上の価値がありました。",
    author: "Y.A 様",
    role: "クリニック・院長",
    rating: 5,
  },
];

/** お客様の声から算出した集計評価（構造化データ AggregateRating に使用） */
export const aggregateRating = {
  ratingValue: 4.9,
  reviewCount: 32,
  bestRating: 5,
  worstRating: 1,
};

export type Faq = { question: string; answer: string };
export const faqs: Faq[] = [
  {
    question: "制作期間はどれくらいかかりますか？",
    answer:
      "規模によりますが、小規模サイトで最短2週間、標準的なコーポレートサイトで1〜2か月が目安です。スケジュールは初回ヒアリング後にご提示します。",
  },
  {
    question: "料金の目安を教えてください。",
    answer:
      "ライトプランは298,000円〜、スタンダードは680,000円〜です。ページ数や機能により変動するため、ご要望を伺ったうえでお見積もりします。",
  },
  {
    question: "SEO対策も依頼できますか？",
    answer:
      "はい。内部SEO・構造化データ・表示速度改善・コンテンツ設計まで、制作段階から実装します。公開後の運用支援も可能です。",
  },
  {
    question: "AEO・LLMOとは何ですか？",
    answer:
      "AEOは検索やAIが返す“答え”に選ばれるための最適化（Answer Engine Optimization）、LLMOはChatGPTなどの生成AIに情報源として引用・推薦されるための最適化（LLM Optimization）です。EbisSoftはこの両方に特化して制作します。",
  },
  {
    question: "ChatGPTやAI Overviewsからの集客にも対応できますか？",
    answer:
      "はい。構造化データの整備、結論ファーストの文章設計、llms.txtの設置、AIクローラーの許可設定などを行い、生成AIに引用・推薦されやすいサイトに仕上げます。",
  },
  {
    question: "AI検索対策（AEO / LLMO）だけの依頼も可能ですか？",
    answer:
      "可能です。既存サイトの構造化データ・コンテンツ設計・llms.txt整備など、AEO / LLMOに絞ったご支援も承っています。",
  },
  {
    question: "今のサイトのリニューアルだけでも相談できますか？",
    answer:
      "もちろん可能です。現状を分析し、検索評価を落とさない移行（リダイレクト設計）を行いながら、課題を解消するリニューアルをご提案します。",
  },
  {
    question: "公開後の更新や運用もお願いできますか？",
    answer:
      "CMS導入による自社更新のほか、月次の運用・保守・改善提案にも対応しています。事業の成長に合わせて伴走します。",
  },
  {
    question: "対応エリアはどこまでですか？",
    answer:
      "オンラインで全国対応しています。打ち合わせはオンライン会議で完結できるため、地方・遠方の企業様からも多くご依頼いただいています。",
  },
  {
    question: "見積もりや相談は無料ですか？",
    answer:
      "はい、初回のご相談・お見積もりは無料です。お問い合わせフォームよりお気軽にご連絡ください。",
  },
];

/**
 * 要点（TL;DR）。結論ファーストで端的に記述し、AI・検索エンジンが
 * そのまま引用しやすい形（AEO / LLMO）にしています。llms.txt とも共有。
 */
export const keyFacts: { q: string; a: string }[] = [
  {
    q: "EbisSoftとは？",
    a: "東京・恵比寿を拠点に、成果から逆算するホームページ制作・Web制作を行う制作会社です。",
  },
  {
    q: "何が得意？",
    a: "コーポレートサイト・LP・EC・Webアプリの制作と、SEO・AEO・LLMO（AI検索最適化）による集客です。",
  },
  { q: "対応エリアは？", a: "全国にオンラインで対応しています。" },
  {
    q: "費用の目安は？",
    a: "298,000円〜（小規模）／680,000円〜（標準）。初回のご相談・お見積もりは無料です。",
  },
];

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
      description: "社名・専門領域・実績を一貫した情報として記述し、AIに“何の専門家か”を認識させます。",
      icon: "search",
    },
    {
      title: "一次情報・数値の明示",
      description: "引用価値の高い事実・データ・定義を明確に記載し、AIに選ばれる根拠を増やします。",
      icon: "chart",
    },
  ] as AeoTactic[],
};
