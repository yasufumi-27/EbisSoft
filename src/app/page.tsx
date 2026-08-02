import { JsonLd } from "@/components/JsonLd";
import { webPageJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { KeyFacts } from "@/components/sections/KeyFacts";
import { Pillars } from "@/components/sections/Pillars";
import { DemoShowcase } from "@/components/sections/DemoShowcase";
import { Strengths } from "@/components/sections/Strengths";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { Faq } from "@/components/sections/Faq";
import { ContactCta } from "@/components/sections/ContactCta";
import { RelatedPages } from "@/components/sections/RelatedPages";
import { SectionNav } from "@/components/fx/SectionNav";
import { faqs } from "@/lib/content";

/**
 * トップページ（会社のホームページ）。
 *
 * 以前は1枚のLPにすべてを載せていましたが、情報量が多く読みにくいため、
 * ここは「各ページの要約と入口」に絞り、詳細は /ai・/web・/embedded に置いています。
 * FAQ もトップは抜粋のみとし、全件は /faq に集約しています（内容の重複を避けるため）。
 */

/** 右端のセクションインジケーター（広い画面のみ表示）。ページ内の id と対応させる。 */
const SECTIONS = [
  { id: "top", label: "TOP" },
  { id: "key-facts", label: "要点" },
  { id: "pillars", label: "事業" },
  { id: "demos", label: "デモ" },
  { id: "strengths", label: "強み" },
  { id: "pricing-teaser", label: "料金" },
  { id: "faq", label: "よくある質問" },
  { id: "contact", label: "お問い合わせ" },
];

/** トップに出す代表的な質問（全件は /faq）。 */
const TOP_FAQ_QUESTIONS = [
  "AIを使うと、制作はどれくらい速くなりますか？",
  "料金の目安を教えてください。",
  "Web制作以外に、組み込み系の開発も依頼できますか？",
  "AIチャットボットは自社の情報に答えられますか？",
  "京都以外の企業でも依頼できますか？",
];

const topFaqs = faqs.filter((f) => TOP_FAQ_QUESTIONS.includes(f.question));

// トップは layout のデフォルトメタデータ（フルタイトル）を継承するため、
// ここでの metadata 上書きは不要です。

export default function Home() {
  return (
    <>
      {/*
        ページ固有の構造化データ。
        サービス一覧は /ai・/web・/embedded、できること一覧は /demo で出力しているため、
        トップでは重複させない（HTMLを軽く保つ／同じ内容を二重に主張しない）。
      */}
      <JsonLd data={[webPageJsonLd(), breadcrumbJsonLd(), faqJsonLd(topFaqs)]} />

      <SectionNav items={SECTIONS} />

      <Hero />
      <TechMarquee />
      <KeyFacts />
      <Pillars />
      <DemoShowcase bg="deep" />
      <Strengths />
      <PricingTeaser />
      <Faq
        items={topFaqs}
        title="よくある質問（抜粋）"
        description="ご相談前によくいただく質問です。ほかの質問は一覧ページにまとめています。"
        moreHref="/faq"
      />
      <RelatedPages hrefs={["/ai", "/web", "/embedded", "/demo", "/company", "/faq"]} />
      <ContactCta />
    </>
  );
}
