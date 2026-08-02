import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";
import { services, techStack } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";

const title = "会社概要";
const description = `${siteConfig.legalName}（${siteConfig.name}）の会社概要です。所在地は${siteConfig.contact.address.region}${siteConfig.contact.address.locality}、京都商工会所属。AIを活用したWeb制作、AIチャットボット開発、3DCG・システム連携に加え、組み込みソフトウェア・IoT開発も提供しています。`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/company" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/company`,
    title: `${title}｜${siteConfig.name}`,
    description,
  },
};

const crumbs = [
  { name: "ホーム", path: "/" },
  { name: "会社概要", path: "/company" },
];

const { contact } = siteConfig;
const fullAddress = `〒${contact.address.postalCode} ${contact.address.region}${contact.address.locality}${contact.address.street}`;

/** 会社概要テーブルの項目（NAPは site.ts の単一情報源から生成し、表記ゆれを作らない） */
const profile: { label: string; value: string }[] = [
  { label: "名称", value: `${siteConfig.legalName}（${siteConfig.name}）` },
  { label: "所在地", value: fullAddress },
  { label: "電話番号", value: `${contact.telephoneDisplay}（${contact.openingHoursDisplay}）` },
  { label: "メールアドレス", value: contact.email },
  { label: "設立", value: "2018年4月" },
  {
    label: "事業内容",
    value:
      "AIを活用したWebサイト制作／AIチャットボット・AI機能開発／3DCG・WebGL・Webアニメーション制作／組み込みソフトウェア・IoT機器開発（ファームウェア・デバイス連携）／SNS連携・業務システム連携／SEO・AEO・LLMO対策／Webサイトの運用・改善",
  },
  { label: "所属団体", value: siteConfig.memberOf.map((m) => m.name).join("／") },
  { label: "対応エリア", value: siteConfig.areaServed },
  { label: "営業時間", value: contact.openingHoursDisplay },
];

/** 私たちの姿勢（E-E-A-T：Trust。約束できることを具体的に明文化） */
const principles = [
  {
    icon: "bolt" as const,
    title: "速さは、手段であって目的ではない",
    body: "短縮した時間はそのまま利益にせず、表示速度・アクセシビリティ・文章の精度に再投資します。速いだけの安いサイトは作りません。",
  },
  {
    icon: "check" as const,
    title: "できること／できないことを、正直に言う",
    body: "本サイトのデモにも、どこまでが実装かを明記しています。受注のために「できます」と言って後から詰まる進め方はしません。",
  },
  {
    icon: "gauge" as const,
    title: "品質は、計測できる形で示す",
    body: "Lighthouseの計測結果を納品時にお渡しします。主観ではなく数値で品質を確認いただけます。",
  },
  {
    icon: "shield" as const,
    title: "安全と法令への配慮を標準にする",
    body: "常時SSL・セキュリティヘッダー・プライバシーポリシーの整備、NDAへの対応まで標準で満たします。",
  },
];

export default function CompanyPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/company",
            name: `${title}｜${siteConfig.name}`,
            description,
            type: "AboutPage",
          }),
          breadcrumbJsonLd(crumbs),
          // 事業者（Organization）は layout.tsx で全ページ共通に出力済み
        ]}
      />

      <Breadcrumbs items={crumbs} />

      <PageHeader
        eyebrow="Company"
        title={
          <>
            {siteConfig.contact.address.locality}から、
            <br />
            <span className="text-gradient">AI時代のWeb</span>をつくる。
          </>
        }
        lead={`${contact.address.region}${contact.address.locality}を拠点に、Web制作と組み込みソフトウェア開発を手がけています（京都商工会所属）。生成AIを制作フローに組み込み、従来の約1/3の期間で高性能なサイトを構築します。AIを「使う側」であると同時に「作る側」でもあること、そして画面の中だけでなく機器のファームウェアまで扱えることが、私たちの特徴です。`}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact" withArrow>
            お問い合わせ
          </ButtonLink>
          <ButtonLink href="/demo" variant="ghost">
            できることを見る
          </ButtonLink>
        </div>
      </PageHeader>

      {/* ------------- 会社概要 ------------- */}
      <Section id="profile">
        <SectionHeading
          eyebrow="Profile"
          title="会社概要"
          description="お取引・お問い合わせの際にご確認ください。"
          align="left"
        />
        <div className="panel panel-corners mt-10 overflow-hidden" data-reveal>
          <dl className="divide-y divide-white/5">
            {profile.map((row) => (
              <div key={row.label} className="grid gap-1 px-6 py-5 sm:grid-cols-4 sm:gap-4">
                <dt className="text-sm font-bold text-slate-400">{row.label}</dt>
                <dd className="speakable text-sm leading-relaxed text-slate-200 sm:col-span-3">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 連絡先（NAPを繰り返し明示：ローカルSEO） */}
        <address className="mt-6 grid gap-4 not-italic sm:grid-cols-3" data-reveal>
          {[
            { icon: "pin" as const, label: "所在地", value: fullAddress, href: undefined },
            {
              icon: "phone" as const,
              label: "電話",
              value: contact.telephoneDisplay,
              href: `tel:${contact.telephone}`,
            },
            {
              icon: "mail" as const,
              label: "メール",
              value: contact.email,
              href: `mailto:${contact.email}`,
            },
          ].map((c) => (
            <div key={c.label} className="panel p-5">
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Icon name={c.icon} className="size-4 text-gold" />
                {c.label}
              </p>
              {c.href ? (
                <a
                  href={c.href}
                  className="mt-2 block text-sm text-slate-200 transition-colors hover:text-brand-light"
                >
                  {c.value}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-slate-200">{c.value}</p>
              )}
            </div>
          ))}
        </address>
      </Section>

      {/* ------------- 姿勢 ------------- */}
      <Section bg="deep">
        <SectionHeading
          eyebrow="Our Principles"
          title="私たちが、約束できること"
          description="Web制作は形が見えにくい買い物です。だからこそ、判断の材料になる約束を先に開示します。"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {principles.map((p, i) => (
            <article
              key={p.title}
              className="panel panel-hover p-6"
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 0.1}s` } as React.CSSProperties}
            >
              <span className="grid size-11 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand-light">
                <Icon name={p.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{p.title}</h3>
              <p className="speakable mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ------------- 事業内容・技術 ------------- */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel panel-corners p-7" data-reveal>
            <h2 className="text-xl font-bold text-white">事業内容</h2>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug} className="flex gap-3">
                  <Icon name="check" className="mt-1 size-4 shrink-0 text-brand" />
                  <span className="text-sm text-slate-300">
                    <span className="font-bold text-white">{s.title}</span>
                    <span className="mt-0.5 block text-slate-500">{s.features.join("／")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="panel p-7" data-reveal>
              <h2 className="text-xl font-bold text-white">主な技術スタック</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                案件ごとに最適な構成を選定します。特定のCMSやフレームワークに縛られた提案はしません。
              </p>
            </div>

            <div className="panel p-7" data-reveal>
              <h2 className="text-xl font-bold text-white">対応エリア</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                打ち合わせはオンライン会議で完結できるため、全国からご依頼いただけます。
                下記エリアは対面での打ち合わせにも伺います。
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {siteConfig.localAreas.map((a) => (
                  <li
                    key={a}
                    className="rounded-md border border-gold/25 bg-gold/[0.07] px-2.5 py-1 text-xs text-gold-light"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
