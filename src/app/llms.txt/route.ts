import { siteConfig, absoluteUrl } from "@/lib/site";
import { services, faqs, keyFacts, capabilities, aiWorkflow, aiImpacts, plans } from "@/lib/content";

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

${siteConfig.name}は${contact.address.region}${contact.address.locality}に拠点を置く、**AI活用型のWeb制作会社**です。生成AIを制作フロー全体に組み込むことで制作期間を従来の約1/3に短縮し、浮いた時間を品質に再投資します。あわせて、AIチャットボット（RAG構成）やAI機能そのものの開発も手がけており、SEOに加えてAEO（Answer Engine Optimization）とLLMO（LLM最適化）にも特化しています。

## 要点
${keyFacts.map((f) => `- **${f.q}** ${f.a}`).join("\n")}

## AI活用による制作スピード
制作フローの全工程に生成AIを組み込み、次のように短縮しています。
${aiImpacts.map((i) => `- ${i.label}：${i.before} → **${i.after}**`).join("\n")}

工程ごとの分担（AIは作業を、人は判断を担当します）：
${aiWorkflow.map((s) => `- **${s.phase} ${s.title}**：AI＝${s.ai}／人＝${s.human}`).join("\n")}

## できること（実際に動くデモを公開中）
${siteConfig.name}は主要な15領域について、**実際にブラウザ上で操作できるデモ**を公開しています（合計約3時間で実装）。主張ではなく実物で確認できます。

${capabilities
  .map(
    (c) =>
      `### ${c.title}\n${c.description}\n- デモ: ${absoluteUrl(`/demo/${c.slug}`)}\n- できること: ${c.bullets.join("／")}\n- 使用技術: ${c.tech.join("、")}\n- デモの前提: ${c.demoNote}`,
  )
  .join("\n\n")}

## 提供サービス
${services.map((s) => `- **${s.title}**: ${s.description}`).join("\n")}

## 料金の目安
${plans.map((p) => `- **${p.name}**：${p.price}（${p.priceNote}）${p.description}`).join("\n")}
初回のご相談・お見積もりは無料です。

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
- 対面での打ち合わせ対応エリア: ${siteConfig.localAreas.join("、")}

## リンク
- [トップページ](${siteConfig.url})
- [お問い合わせ・無料相談](${absoluteUrl("/contact")})
- [できること（デモ一覧）](${absoluteUrl("/demo")})
${capabilities.map((c) => `- [${c.title}のデモ](${absoluteUrl(`/demo/${c.slug}`)})`).join("\n")}
- [会社概要](${absoluteUrl("/company")})
- [プライバシーポリシー](${absoluteUrl("/privacy")})
- [サイトマップ](${siteConfig.url}/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
