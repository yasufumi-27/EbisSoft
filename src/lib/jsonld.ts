/**
 * 構造化データ（JSON-LD / schema.org）のビルダー。
 * Google が理解できる形で「事業者」「サイト」「サービス」「FAQ」「パンくず」を記述し、
 * リッチリザルトやナレッジパネルの対象になりやすくします。
 *
 * @id で各ノードを相互参照し、重複のない一貫したグラフを作ります。
 * 実在しない評価（レビュー）等は出力しません（誤解を招く構造化データはE-E-A-T上の不利）。
 */

import { siteConfig, absoluteUrl } from "@/lib/site";
import { faqs, services, steps, capabilities, type Capability } from "@/lib/content";

type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** ビルド時点の日付（静的書き出しのため生成時に固定される） */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * 事業者（ProfessionalService = LocalBusiness のサブタイプ）。
 * 住所・座標・営業時間・提供サービスを持たせ、ローカルSEO（京都市伏見区）に対応。
 */
export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": ORGANIZATION_ID,
    name: siteConfig.legalName,
    alternateName: [siteConfig.name, siteConfig.reading],
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
    },
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    slogan: "AIを駆使して、最速で、高性能なサイトを。",
    foundingDate: siteConfig.foundingDate,
    telephone: siteConfig.contact.telephone,
    email: siteConfig.contact.email,
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "JPY",
    // 専門領域を明示し、AI/LLMに「何の専門家か」を理解させる（LLMO）
    knowsAbout: [...siteConfig.knowsAbout],
    knowsLanguage: ["ja", "en"],
    address: {
      "@type": "PostalAddress",
      postalCode: siteConfig.contact.address.postalCode,
      addressRegion: siteConfig.contact.address.region,
      addressLocality: siteConfig.contact.address.locality,
      streetAddress: siteConfig.contact.address.street,
      addressCountry: siteConfig.contact.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.contact.geo.latitude,
      longitude: siteConfig.contact.geo.longitude,
    },
    areaServed: siteConfig.areaServedList.map((a) => ({ "@type": "AdministrativeArea", name: a })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    sameAs: [...siteConfig.sameAs],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: siteConfig.contact.telephone,
      email: siteConfig.contact.email,
      areaServed: "JP",
      availableLanguage: ["Japanese", "English"],
    },
    // 提供サービスのカタログ（AIがサービス内容を構造的に把握できる）
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${siteConfig.name}の提供サービス`,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
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
    alternateName: siteConfig.legalName,
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** パンくず（BreadcrumbList）。 */
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
    name: `${siteConfig.name}のWeb制作サービス`,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        serviceType: s.title,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: siteConfig.areaServedList.map((a) => ({
          "@type": "AdministrativeArea",
          name: a,
        })),
      },
    })),
  };
}

/**
 * 「できること」一覧（ItemList）。各項目を実際に触れるデモページに紐づけ、
 * AI・検索エンジンに「主張ではなく実物がある」ことを伝えます。
 */
export function capabilitiesJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name}でできること（実動デモつき）`,
    description:
      "3DCG・Webアニメーション・AIチャットボット・SNS連携・システム連携。それぞれ実際に動くデモを公開しています。",
    itemListElement: capabilities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: absoluteUrl(`/demo/${c.slug}`),
      item: {
        "@type": "Service",
        name: c.title,
        description: c.description,
        serviceType: c.title,
        url: absoluteUrl(`/demo/${c.slug}`),
        provider: { "@id": ORGANIZATION_ID },
      },
    })),
  };
}

/** FAQ（FAQPage）。content.ts の faqs と同期。 */
export function faqJsonLd(items: { question: string; answer: string }[] = faqs): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
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
    name: `${siteConfig.name}のWeb制作の流れ`,
    description: "ご相談から公開・運用まで、AIを活用したWebサイト制作のステップ。",
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
export function webPageJsonLd(opts?: {
  path?: string;
  name?: string;
  description?: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage";
}): JsonLd {
  const path = opts?.path ?? "/";
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": opts?.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts?.name ?? siteConfig.title,
    description: opts?.description ?? siteConfig.description,
    inLanguage: siteConfig.lang,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    primaryImageOfPage: absoluteUrl("/opengraph-image"),
    datePublished: siteConfig.foundingDate,
    dateModified: BUILD_DATE,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable"],
    },
  };
}

/**
 * デモページ（できること）の構造化データ。
 * 実際に操作できるデモを WebApplication として明示し、
 * 「説明ではなく動く実物がある」ことを検索エンジン・生成AIに伝えます。
 */
export function capabilityJsonLd(c: Capability): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/demo/${c.slug}`)}#service`,
    name: c.title,
    description: c.description,
    serviceType: c.title,
    url: absoluteUrl(`/demo/${c.slug}`),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: siteConfig.areaServedList.map((a) => ({ "@type": "AdministrativeArea", name: a })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${c.title}でできること`,
      itemListElement: c.bullets.map((b) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: b },
      })),
    },
    subjectOf: {
      "@type": "WebApplication",
      name: `${c.title}のデモ`,
      description: c.demoNote,
      url: absoluteUrl(`/demo/${c.slug}`),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      browserRequirements: "モダンブラウザ（JavaScript有効）",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      publisher: { "@id": ORGANIZATION_ID },
    },
  };
}
