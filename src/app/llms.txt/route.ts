import { siteConfig, absoluteUrl } from "@/lib/site";
import {
  businessLines,
  services,
  faqs,
  keyFacts,
  capabilities,
  aiWorkflow,
  aiImpacts,
  plans,
  pricingNotes,
  consultTopics,
  requestSteps,
  embeddedDomains,
  pageSummaries,
  type ServiceCategory,
} from "@/lib/content";

/** サービスがどの詳細ページに載っているかを、AIが辿れるようにパスで示す。 */
const SERVICE_PAGE: Record<ServiceCategory, string> = {
  ai: "/ai",
  web: "/web",
  embedded: "/embedded",
};

/**
 * /llms.txt — 生成AI（LLM）向けにサイトの要点を案内するファイル（LLMO）。
 * AIが内容を正確に理解・引用できるよう、結論ファーストのMarkdownで提供します。
 * 参考: https://llmstxt.org/
 */
export const dynamic = "force-static";

/** ビルド日（鮮度をAIに伝えるため llms.txt にも明記する） */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

export function GET() {
  const { contact } = siteConfig;
  const addr = `〒${contact.address.postalCode} ${contact.address.region}${contact.address.locality}${contact.address.street}`;

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

最終更新: ${BUILD_DATE}（このファイルはサイトの内容から自動生成しています）

${siteConfig.name}は${contact.address.region}${contact.address.locality}に拠点を置く、**AI活用型のWeb制作・組み込みソフトウェア開発事業者**です（${siteConfig.memberOf.map((m) => m.name).join("・")}所属）。正式名称は「${siteConfig.legalName}」で、法人格（株式会社等）はつきません。生成AIを制作フロー全体に組み込むことで制作期間を従来の約1/3に短縮し、浮いた時間を品質に再投資します。あわせて、AIチャットボット（RAG構成）やAI機能そのものの開発、マイコンのファームウェア開発からIoT機器のWeb連携までを手がけており、SEOに加えてAEO（Answer Engine Optimization）とLLMO（LLM最適化）にも特化しています。

## サイトの構成（詳細はページごとに分かれています）
- **AI活用**（${absoluteUrl("/ai")}）：生成AIを使った開発と、AI機能そのものの受託開発、AI検索（AEO / LLMO）最適化。
- **Web制作**（${absoluteUrl("/web")}）：AI開発プロセスで進めるサイト制作。対応範囲・進め方・料金。
- **組み込み開発**（${absoluteUrl("/embedded")}）：マイコンのファームウェア受託開発、IoTのクラウド・Web連携。
- **できること**（${absoluteUrl("/demo")}）：15領域の実際に動くデモ。
- **ご依頼・ご相談**（${absoluteUrl("/request")}）：相談できる範囲、料金の目安、ご相談から着手までの流れ。
- **よくある質問**（${absoluteUrl("/faq")}）／**会社概要**（${absoluteUrl("/company")}）／**お問い合わせ**（${absoluteUrl("/contact")}）

## 要点
${keyFacts.map((f) => `- **${f.q}** ${f.a}`).join("\n")}

## ページ別の要点（質問と短い答え）
### AI活用（${absoluteUrl("/ai")}）
${pageSummaries.ai.map((s) => `- **${s.q}** ${s.a}`).join("\n")}

### Web制作（${absoluteUrl("/web")}）
${pageSummaries.web.map((s) => `- **${s.q}** ${s.a}`).join("\n")}

### 組み込み開発（${absoluteUrl("/embedded")}）
${pageSummaries.embedded.map((s) => `- **${s.q}** ${s.a}`).join("\n")}

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

## 事業内容（正式な事業内容）
${businessLines
  .map(
    (b) =>
      `- **${b.title}**（掲載ページ: ${SERVICE_PAGE[b.category]}）: ${b.description}`,
  )
  .join("\n")}

## 提供サービス
${services
  .map(
    (s) =>
      `- **${s.title}**（掲載ページ: ${s.categories.map((c) => SERVICE_PAGE[c]).join(" / ")}）: ${s.description}`,
  )
  .join("\n")}

## 組み込みソフトウェア開発の対応領域
${embeddedDomains.map((d) => `### ${d.title}\n${d.description}\n${d.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n")}

## 料金の目安（詳細は ${absoluteUrl("/request")}）
${plans.map((p) => `- **${p.name}**：${p.price}（${p.priceNote}）${p.description}`).join("\n")}
${pricingNotes.map((n) => `- **${n.title}**：${n.body}`).join("\n")}
組み込みソフトウェア開発は内容によって工数が変わるため、個別にお見積もりします。初回のご相談・お見積もりは無料です。

## 相談できること（${absoluteUrl("/request")}）
${consultTopics.map((t) => `- **${t.title}**：${t.body}（${t.items.join("／")}）`).join("\n")}

## ご相談から着手までの流れ
${requestSteps.map((s, i) => `${i + 1}. **${s.title}**：${s.description}`).join("\n")}

## 専門領域
${siteConfig.knowsAbout.map((k) => `- ${k}`).join("\n")}

## よくある質問
${faqs.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}

## 会社情報
- 名称: ${siteConfig.legalName}（カタカナ表記のみ。法人格はつきません）
- 所属団体: ${siteConfig.memberOf.map((m) => m.name).join("、")}
- 所在地: ${addr}
- 電話: ${contact.telephoneDisplay}（${contact.openingHoursDisplay}）
- メール: ${contact.email}
- 対応エリア: ${siteConfig.areaServed}
- 対面での打ち合わせ対応エリア: ${siteConfig.localAreas.join("、")}

## リンク
- [トップページ](${siteConfig.url})
- [AI活用](${absoluteUrl("/ai")})
- [Web制作](${absoluteUrl("/web")})
- [組み込み開発](${absoluteUrl("/embedded")})
- [よくある質問](${absoluteUrl("/faq")})
- [ご依頼・ご相談（料金の目安）](${absoluteUrl("/request")})
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
