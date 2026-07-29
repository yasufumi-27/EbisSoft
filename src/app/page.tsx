import { JsonLd } from "@/components/JsonLd";
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  servicesJsonLd,
  capabilitiesJsonLd,
  howToJsonLd,
  faqJsonLd,
} from "@/lib/jsonld";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { KeyFacts } from "@/components/sections/KeyFacts";
import { Strengths } from "@/components/sections/Strengths";
import { AiPower } from "@/components/sections/AiPower";
import { Capabilities } from "@/components/sections/Capabilities";
import { Services } from "@/components/sections/Services";
import { AiSearch } from "@/components/sections/AiSearch";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { ContactCta } from "@/components/sections/ContactCta";

// トップは layout のデフォルトメタデータ（フルタイトル）を継承するため、
// ここでの metadata 上書きは不要です。

export default function Home() {
  return (
    <>
      {/* ページ固有の構造化データ（WebPage/Speakable・パンくず・サービス・できること・HowTo・FAQ） */}
      <JsonLd
        data={[
          webPageJsonLd(),
          breadcrumbJsonLd(),
          servicesJsonLd(),
          capabilitiesJsonLd(),
          howToJsonLd(),
          faqJsonLd(),
        ]}
      />

      <Hero />
      <TechMarquee />
      <KeyFacts />
      <Strengths />
      <AiPower />
      <Capabilities />
      <Services />
      <AiSearch />
      <Pricing />
      <Process />
      <Faq />
      <ContactCta />
    </>
  );
}
