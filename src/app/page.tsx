import { JsonLd } from "@/components/JsonLd";
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  servicesJsonLd,
  howToJsonLd,
  faqJsonLd,
} from "@/lib/jsonld";
import { Hero } from "@/components/sections/Hero";
import { KeyFacts } from "@/components/sections/KeyFacts";
import { Strengths } from "@/components/sections/Strengths";
import { Services } from "@/components/sections/Services";
import { AiSearch } from "@/components/sections/AiSearch";
import { Works } from "@/components/sections/Works";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { ContactCta } from "@/components/sections/ContactCta";

// トップは layout のデフォルトメタデータ（フルタイトル）を継承するため、
// ここでの metadata 上書きは不要です。

export default function Home() {
  return (
    <>
      {/* ページ固有の構造化データ（WebPage/Speakable・パンくず・サービス・HowTo・FAQ） */}
      <JsonLd
        data={[
          webPageJsonLd(),
          breadcrumbJsonLd(),
          servicesJsonLd(),
          howToJsonLd(),
          faqJsonLd(),
        ]}
      />

      <Hero />
      <KeyFacts />
      <Strengths />
      <Services />
      <AiSearch />
      <Works />
      <Pricing />
      <Process />
      <Testimonials />
      <Faq />
      <ContactCta />
    </>
  );
}
