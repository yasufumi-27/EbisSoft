/**
 * 構造化データ（JSON-LD / schema.org）のビルダー。
 * Google が理解できる形で「事業者」「サイト」「サービス」「FAQ」「パンくず」を記述し、
 * リッチリザルトやナレッジパネルの対象になりやすくします。
 *
 * @id で各ノードを相互参照し、重複のない一貫したグラフを作ります。
 */

import { siteConfig, absoluteUrl } from "@/lib/site";
import { faqs, services, aggregateRating, steps } from "@/lib/content";

type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/**
 * 事業者（ProfessionalService = LocalBusiness のサブタイプ）。
 * 住所・電話・営業時間・評価を持たせ、ローカルSEOに対応。
 */
export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
    },
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    telephone: siteConfig.contact.telephone,
    email: siteConfig.contact.email,
    priceRange: siteConfig.priceRange,
    areaServed: siteConfig.areaServed,
    // 専門領域を明示し、AI/LLMに「何の専門家か」を理解させる（LLMO）
    knowsAbout: [...siteConfig.knowsAbout],
    address: {
      "@type": "PostalAddress",
      postalCode: siteConfig.contact.address.postalCode,
      addressRegion: siteConfig.contact.address.region,
      addressLocality: siteConfig.contact.address.locality,
      streetAddress: siteConfig.contact.address.street,
      addressCountry: siteConfig.contact.address.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    sameAs: siteConfig.sameAs,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
    },
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.description,
      },
    })),
  };
}

/** サイト本体（WebSite）。publisher で事業者を参照。 */
export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: siteConfig.lang,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** パンくず（BreadcrumbList）。トップのみだが将来の下層ページに備えて用意。 */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[] = [{ name: "ホーム", path: "/" }],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** 提供サービス一覧（ItemList）。各サービスを provider に紐づけ。 */
export function servicesJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EbisSoftのWeb制作サービス",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        serviceType: s.title,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: siteConfig.areaServed,
      },
    })),
  };
}

/** FAQ（FAQPage）。content.ts の faqs と同期。 */
export function faqJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/** 制作の流れ（HowTo）。AEO（手順系の回答）に有効。content.ts の steps と同期。 */
export function howToJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "EbisSoftのWeb制作の流れ",
    description: "ご相談から公開・運用までのWebサイト制作ステップ。",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };
}

/**
 * ページ本体（WebPage）。
 * speakable で音声アシスタント/回答エンジンに読み上げ・抽出してほしい箇所
 * （.speakable クラスの要点・FAQ）を指定します（AEO）。
 */
export function webPageJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    primaryImageOfPage: absoluteUrl("/opengraph-image"),
    datePublished: siteConfig.foundingDate,
    dateModified: new Date().toISOString().slice(0, 10),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable"],
    },
  };
}
