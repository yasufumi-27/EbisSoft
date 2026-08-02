import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, capabilityJsonLd, webPageJsonLd } from "@/lib/jsonld";
import { capabilities, getCapability } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { DemoLoader } from "@/components/demos/DemoLoader";

// 静的書き出し（GitHub Pages）に対応するため、存在するスラッグのみ生成する
export const dynamicParams = false;

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cap = getCapability(slug);
  if (!cap) return {};

  const title = `${cap.title}｜実際に動くデモで確かめる`;
  const description = `${cap.tagline} ${cap.description}`.slice(0, 150);

  return {
    title,
    description,
    alternates: { canonical: `/demo/${cap.slug}` },
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/demo/${cap.slug}`,
      title: `${title}｜${siteConfig.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}｜${siteConfig.name}`,
      description,
    },
  };
}

export default async function DemoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cap = getCapability(slug);
  if (!cap) notFound();

  const others = capabilities.filter((c) => c.slug !== cap.slug);

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "できること", path: "/demo" },
    { name: cap.title, path: `/demo/${cap.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: `/demo/${cap.slug}`,
            name: `${cap.title}｜${siteConfig.name}`,
            description: cap.description,
          }),
          breadcrumbJsonLd(crumbs),
          capabilityJsonLd(cap),
        ]}
      />

      <Breadcrumbs items={crumbs} />

      <PageHeader eyebrow="Capability Demo" title={cap.title} lead={cap.impact}>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span className="font-display inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-bold tracking-wider text-gold-light">
            <Icon name="bolt" className="size-3.5" />
            このデモの実装時間 {cap.buildTime}
          </span>
          <span className="text-xs text-slate-500">AIを活用した制作体制で構築</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact" withArrow>
            このデモについて相談する
          </ButtonLink>
          <ButtonLink href="/demo" variant="ghost">
            ほかのデモを見る
          </ButtonLink>
        </div>
      </PageHeader>

      {/* ------------- 実際に動くデモ ------------- */}
      <section id="demo" className="scroll-mt-20 pb-4">
        <Container>
          <DemoLoader slug={cap.slug} />

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="panel p-5" data-reveal>
              <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                <Icon name="play" className="size-4 text-brand" />
                デモの使い方
              </h2>
              <ul className="mt-3 space-y-1.5">
                {cap.howToUse.map((h) => (
                  <li key={h} className="flex gap-2 text-xs text-slate-400">
                    <Icon name="arrowRight" className="mt-0.5 size-3 shrink-0 text-brand" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* 前提・制約は読みたい人だけが開く（本文はDOMに残るのでSEOに影響なし） */}
            <details className="demo-note self-start" data-reveal>
              <summary>
                <span className="font-display mr-2 text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                  Note
                </span>
                どこまでが実装で、本番では何が変わるか
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">{cap.demoNote}</p>
            </details>
          </div>
        </Container>
      </section>

      {/* ------------- 導入すると何が変わるか（ここが一番読ませたい） ------------- */}
      <Section bg="deep">
        <SectionHeading
          eyebrow="Business Impact"
          title="導入すると、何が変わるか"
          description={cap.description}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cap.businessValue.map((v, i) => (
            <article
              key={v.title}
              className="panel panel-corners flex flex-col p-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 0.1}s` } as React.CSSProperties}
            >
              <span className="font-display text-3xl font-bold text-white/10">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg leading-snug font-bold text-white">{v.title}</h3>
              <p className="speakable mt-3 text-sm leading-relaxed text-slate-400">{v.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ------------- できること・活用シーン・技術 ------------- */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel panel-corners p-7" data-reveal>
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Icon name="check" className="size-5 text-brand" />
              できること
            </h2>
            <ul className="mt-5 space-y-3">
              {cap.bullets.map((b) => (
                <li key={b} className="speakable flex gap-2.5 text-sm leading-relaxed text-slate-300">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="panel p-7"
            data-reveal
            style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Icon name="target" className="size-5 text-gold" />
              こんな企業に
            </h2>
            <ul className="mt-5 space-y-3">
              {cap.useCases.map((u) => (
                <li key={u} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                  <Icon name="arrowRight" className="mt-0.5 size-4 shrink-0 text-gold" />
                  {u}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="panel p-7"
            data-reveal
            style={{ "--reveal-delay": "0.2s" } as React.CSSProperties}
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Icon name="code" className="size-5 text-accent-light" />
              使用する技術
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {cap.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              案件の要件・既存環境に合わせて選定します。ライブラリを増やすことによる表示速度への影響も評価したうえでご提案します。
            </p>
          </div>
        </div>
      </Section>

      {/* ------------- ほかのデモ ------------- */}
      <Section bg="deep">
        <SectionHeading
          eyebrow="Other Demos"
          title="ほかにも、こんなことができます"
          description="すべて実際に動くデモをご用意しています。"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o, i) => (
            <Link
              prefetch={false}
              key={o.slug}
              href={`/demo/${o.slug}`}
              className="panel panel-hover flex flex-col p-5"
              data-reveal
              style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400">
                <Icon name={o.icon} className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-white">{o.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{o.impact}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-light">
                デモを見る
                <Icon name="arrowRight" className="size-3" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* ------------- CTA ------------- */}
      <Section>
        <div className="panel panel-corners p-8 text-center sm:p-12" data-reveal>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {cap.title}を、自社サイトでも。
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
            「どこまでできるか」「いくらかかるか」だけでも構いません。初回のご相談・お見積もりは無料です。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" size="lg" withArrow>
              無料で相談する
            </ButtonLink>
            <ButtonLink href="/#pricing" size="lg" variant="secondary">
              料金を見る
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
