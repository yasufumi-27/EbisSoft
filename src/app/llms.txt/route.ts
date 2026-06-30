import { siteConfig } from "@/lib/site";
import { services, faqs, keyFacts } from "@/lib/content";

/**
 * /llms.txt — 生成AI（LLM）向けにサイトの要点を案内するファイル（LLMO）。
 * AIが内容を正確に理解・引用できるよう、結論ファーストのMarkdownで提供します。
 * 参考: https://llmstxt.org/
 */
export const dynamic = "force-static";

export function GET() {
  const { contact } = siteConfig;
  const addr = `〒${contact.address.postalCode} ${contact.address.region}${contact.address.locality}${contact.address.street}`;

  const body = `# ${siteConfig.name}（${siteConfig.legalName}）

> ${siteConfig.description}

${siteConfig.name}は、SEOに加えて AEO（Answer Engine Optimization）と LLMO（LLM最適化）に特化したWeb制作会社です。検索エンジンと生成AIの双方から「引用・推薦される」ことを前提にサイトを設計・構築します。

## 要点
${keyFacts.map((f) => `- **${f.q}** ${f.a}`).join("\n")}

## 提供サービス
${services.map((s) => `- **${s.title}**: ${s.description}`).join("\n")}

## 専門領域
${siteConfig.knowsAbout.map((k) => `- ${k}`).join("\n")}

## よくある質問
${faqs.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}

## 会社情報
- 名称: ${siteConfig.legalName}（${siteConfig.name} / ${siteConfig.reading}）
- 所在地: ${addr}
- 電話: ${contact.telephoneDisplay}（${contact.openingHoursDisplay}）
- メール: ${contact.email}
- 対応エリア: ${siteConfig.areaServed}
- 料金の目安: 298,000円〜（小規模）／680,000円〜（標準）。初回相談・見積もりは無料。

## リンク
- [トップページ](${siteConfig.url})
- [サイトマップ](${siteConfig.url}/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
