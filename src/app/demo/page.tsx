import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, capabilitiesJsonLd, webPageJsonLd } from "@/lib/jsonld";
import { capabilities } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";

const title = "できること（実際に動くデモ一覧）";
const description =
  "3DCG・WebGL、Web内アニメーション、AIチャットボット、SNS連携、業務システム連携。EbisuSoftができることを、説明ではなく実際に動くデモで公開しています。発注前に実力をご確認ください。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/demo" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/demo`,
    title: `${title}｜${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title}｜${siteConfig.name}`,
    description,
  },
};

const crumbs = [
  { name: "ホーム", path: "/" },
  { name: "できること", path: "/demo" },
];

export default function DemoIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/demo",
            name: `${title}｜${siteConfig.name}`,
            description,
            type: "CollectionPage",
          }),
          breadcrumbJsonLd(crumbs),
          capabilitiesJsonLd(),
        ]}
      />

      <Breadcrumbs items={crumbs} />

      <PageHeader
        eyebrow="Capabilities"
        title={
          <>
            こんなことが、できます。
            <br />
            <span className="text-gradient">全部、動かせます。</span>
          </>
        }
        lead="Web制作会社の「できます」ほど当てにならないものはありません。だからEbisuSoftは、主要な5領域すべてを実際に触れるデモとして公開しています。動くものを見てから、ご判断ください。"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/#contact" withArrow>
            無料で相談する
          </ButtonLink>
          <ButtonLink href="/#ai-power" variant="ghost">
            AI活用の仕組みを見る
          </ButtonLink>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {capabilities.map((c, i) => (
            <article
              key={c.slug}
              className="panel panel-hover panel-corners flex flex-col p-7"
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 0.1}s` } as React.CSSProperties}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${c.gradient} text-ink shadow-[0_0_22px_rgba(34,211,238,0.25)]`}
                >
                  <Icon name={c.icon} className="size-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">{c.title}</h2>
                  <p className="mt-1 text-sm text-brand-light">{c.tagline}</p>
                </div>
              </div>

              <p className="speakable mt-5 text-sm leading-relaxed text-slate-400">
                {c.description}
              </p>

              <ul className="mt-5 space-y-2">
                {c.bullets.slice(0, 3).map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm text-slate-300">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" />
                    {b}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-2">
                {c.tech.slice(0, 4).map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <Link
                  href={`/demo/${c.slug}`}
                  className="btn btn-primary inline-flex h-11 items-center px-6 text-sm"
                >
                  デモを動かす
                  <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section bg="deep">
        <div className="panel panel-corners mx-auto max-w-3xl p-8 text-center sm:p-12" data-reveal>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ここにないことも、たいていできます。
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            掲載しているのは代表的な5領域です。「こんなことはできますか？」というご相談は、実現方法・概算費用・期間まで含めて無料でお答えします。AIを活用した制作体制なので、検証用のプロトタイプを短期間でお出しすることも可能です。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/#contact" size="lg" withArrow>
              できるか相談する
            </ButtonLink>
            <ButtonLink href="/company" size="lg" variant="secondary">
              会社概要を見る
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
